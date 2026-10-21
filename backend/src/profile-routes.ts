import { Router } from 'express';
import mongoose from 'mongoose';
import { asyncRoute, currentSession, HttpError, rejectAgencyInput, requireCsrf, requireOwnerWritable, requirePortal } from './auth.js';
import { Agency, User, WebsiteDraft } from './models.js';
import { ownerCanEdit, ReviewError } from './review.js';
import { ownerScope, tenantAgencyFilter } from './tenant.js';
import { profileSchema } from './validation.js';
import { mapFromAgency } from './website.js';

// Phase 3a Agency Profile (docs/PHASE-3A-AGENCY-PROFILE-CONTRACT-APPROVED.md). Agency comes from the session only.
const router = Router();

type ProfileAgency = {
  name: string; mobileE164: string; whatsappE164: string; reviewStatus: string; restrictionStatus?: string | null;
  publicContact?: { showMobile?: boolean | null; showWhatsapp?: boolean | null } | null;
  profile?: { description?: string | null; officeAddress?: string | null; city?: string | null; serviceAreas?: string | null; publicEmail?: string | null } | null;
  profileVersion?: number | null; profileUpdatedAt?: Date | null;
};

/** Only set optional values are returned, so "not set" is simply absent. */
export function profileDetails(agency: ProfileAgency) {
  const profile = agency.profile ?? {};
  return Object.fromEntries(['description', 'officeAddress', 'city', 'serviceAreas', 'publicEmail']
    .map((key) => [key, profile[key as keyof typeof profile]]).filter(([, value]) => value));
}
export function publicContactView(agency: ProfileAgency) {
  return { showMobile: agency.publicContact?.showMobile ?? false, showWhatsapp: agency.publicContact?.showWhatsapp ?? false };
}
function profileView(agency: ProfileAgency, owner: { name: string; emailNormalized: string }) {
  return {
    agencyName: agency.name, ownerName: owner.name, loginEmail: owner.emailNormalized,
    mobile: agency.mobileE164, whatsapp: agency.whatsappE164,
    publicContact: publicContactView(agency), profile: profileDetails(agency),
    version: agency.profileVersion ?? 0, updatedAt: agency.profileUpdatedAt ?? null,
    canEdit: ownerCanEdit(agency),
  };
}

router.get('/owner/profile', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  rejectAgencyInput(request);
  const context = await currentSession(request);
  const agency = await Agency.findOne(tenantAgencyFilter(ownerScope(context!.user))).lean();
  if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  response.json({ data: profileView(agency, context!.user) });
}));

router.put('/owner/profile', asyncRoute(async (request, response) => {
  requirePortal(request, 'OWNER');
  await requireCsrf(request, true);
  requireOwnerWritable(request);
  rejectAgencyInput(request);
  const input = profileSchema.parse(request.body);
  const scope = ownerScope(request.sessionContext!.user);
  await mongoose.connection.transaction(async (session) => {
    const agency = await Agency.findOne(tenantAgencyFilter(scope)).session(session);
    if (!agency) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
    if (!ownerCanEdit(agency)) {
      if ((agency.restrictionStatus ?? 'NONE') === 'DEACTIVATED') throw new HttpError(403, 'AGENCY_DEACTIVATED', 'Your agency account is deactivated. Contact EstateOS support.');
      throw new ReviewError(403, 'PROFILE_READ_ONLY', 'Your agency details can no longer be changed. Contact EstateOS support.');
    }
    if ((agency.profileVersion ?? 0) !== input.expectedProfileVersion) {
      throw new ReviewError(409, 'PROFILE_CONFLICT', 'These details were changed in another window. Reload to see the latest version.');
    }
    const result = await Agency.updateOne(
      { _id: agency._id, profileVersion: input.expectedProfileVersion },
      {
        $set: {
          name: input.agencyName, mobileE164: input.mobile, whatsappE164: input.whatsapp,
          publicContact: input.publicContact, profile: input.profile, profileUpdatedAt: new Date(),
        },
        $inc: { profileVersion: 1 },
      },
      { session },
    );
    if (result.modifiedCount !== 1) throw new ReviewError(409, 'PROFILE_CONFLICT', 'These details were changed in another window. Reload to see the latest version.');
    await User.updateOne({ _id: scope.userId, role: 'AGENCY_OWNER', agencyId: agency._id }, { $set: { name: input.ownerName } }, { session });
    // D-085 (Phase 3b §3): stage the saved public-eligible values into the private website draft, same transaction.
    const mapped = mapFromAgency({
      _id: agency._id, name: input.agencyName, mobileE164: input.mobile, whatsappE164: input.whatsapp, reviewStatus: agency.reviewStatus,
      publicContact: input.publicContact, profile: input.profile,
    });
    await WebsiteDraft.updateOne({ agencyId: agency._id }, { $set: { mapped } }, { session, upsert: true });
  });
  const [agency, owner] = await Promise.all([
    Agency.findOne(tenantAgencyFilter(scope)).lean(),
    User.findById(scope.userId).select('name emailNormalized').lean(),
  ]);
  if (!agency || !owner) throw new HttpError(404, 'NOT_FOUND', 'Agency not found');
  response.json({ data: profileView(agency, owner) });
}));

export { router as profileRouter };
