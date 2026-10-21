import type { Types } from 'mongoose';

export type OwnerScope = Readonly<{ userId: string; agencyId: string }>;

export function ownerScope(user: { _id: Types.ObjectId; role: string; agencyId?: Types.ObjectId | null }): OwnerScope {
  if (user.role !== 'AGENCY_OWNER' || !user.agencyId) throw new Error('FORBIDDEN_TENANT_SCOPE');
  return Object.freeze({ userId: user._id.toString(), agencyId: user.agencyId.toString() });
}

export function tenantAgencyFilter(scope: OwnerScope, requestedId?: string): { _id: string } {
  if (!scope.agencyId || (requestedId && requestedId !== scope.agencyId)) throw new Error('NOT_FOUND_TENANT');
  return { _id: scope.agencyId };
}

export type SuperAdminScope = Readonly<{ userId: string }>;

/** The only entry point for cross-agency reads/writes; Super Admin portal sessions only (D-072, D-089). */
export function superAdminScope(user: { _id: Types.ObjectId; role: string; agencyId?: Types.ObjectId | null }): SuperAdminScope {
  if (user.role !== 'SUPER_ADMIN' || user.agencyId) throw new Error('FORBIDDEN_PLATFORM_SCOPE');
  return Object.freeze({ userId: user._id.toString() });
}
