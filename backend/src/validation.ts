import { z } from 'zod';
import { normalizeEmail, validatePassword } from './security.js';

const email = z.string().trim().pipe(z.email().max(254)).transform(normalizeEmail);
const name = (max: number) => z.string().trim().min(2).max(max);
const phone = z.string().trim().transform((input, context) => {
  const compact = input.replace(/[\s()-]/g, '');
  let normalized = compact;
  if (/^03\d{9}$/.test(compact)) normalized = `+92${compact.slice(1)}`;
  else if (/^92\d{10}$/.test(compact)) normalized = `+${compact}`;
  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    context.addIssue({ code: 'custom', message: 'Enter a valid phone number' });
    return z.NEVER;
  }
  return normalized;
});
export const signupSchema = z.strictObject({
  ownerName: name(100), agencyName: name(120), mobile: phone, whatsapp: phone,
  email, password: z.string().min(12).max(128),
}).refine((input) => validatePassword(input.password, [input.email, input.ownerName, input.agencyName]), { message: 'Choose a stronger password', path: ['password'] });
export const loginSchema = z.strictObject({ email, password: z.string().min(1).max(1024) });
export const resetSchema = z.strictObject({ resetCode: z.string().min(32).max(128), newPassword: z.string().min(12).max(128) })
  .refine((input) => validatePassword(input.newPassword), { message: 'Choose a stronger password', path: ['newPassword'] });

// Phase 2a review contract §5.
const reviewReason = z.string().trim().min(10, 'Reason must be at least 10 characters').max(1000, 'Reason must be at most 1000 characters');
const expectedReviewVersion = z.number().int().min(0);
export const reviewDecisionSchema = z.discriminatedUnion('decision', [
  z.strictObject({ decision: z.literal('APPROVE'), expectedReviewVersion }),
  z.strictObject({ decision: z.literal('REQUEST_CHANGES'), reason: reviewReason, expectedReviewVersion }),
  z.strictObject({ decision: z.literal('REJECT'), reason: reviewReason, expectedReviewVersion }),
]);
export const reopenSchema = z.strictObject({ reason: reviewReason, expectedReviewVersion });
export const resubmitSchema = z.strictObject({ expectedReviewVersion });
export const reviewQueueQuerySchema = z.strictObject({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});

// Phase 2b directory and restriction contract §6.
export const restrictionSchema = z.strictObject({
  action: z.enum(['BLOCK', 'DEACTIVATE', 'RESTORE']),
  reason: reviewReason,
  expectedRestrictionVersion: z.number().int().min(0),
});
export const directoryQuerySchema = z.strictObject({
  q: z.string().trim().min(2, 'Search must be at least 2 characters').max(100).optional(),
  review: z.enum(['PENDING', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED']).optional(),
  restriction: z.enum(['NONE', 'BLOCKED', 'DEACTIVATED']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().max(200).optional(),
});
