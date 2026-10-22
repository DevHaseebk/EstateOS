import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { AuthAudit, User } from '../models.js';
import { digest, normalizeEmail, randomToken } from '../security.js';

async function main(): Promise<void> {
  const email = process.env.RECOVERY_EMAIL ? normalizeEmail(process.env.RECOVERY_EMAIL) : undefined;
  const operator = process.env.RECOVERY_OPERATOR?.trim();
  const method = process.env.RECOVERY_VERIFICATION_METHOD?.trim();
  const secondApprover = process.env.RECOVERY_SECOND_APPROVER?.trim();
  if (!env.mongoUri || !email || !operator || !method || process.env.RECOVERY_ATTESTED !== 'YES') {
    throw new Error('Recovery requires target, operator, documented identity method and explicit attestation');
  }
  await mongoose.connect(env.mongoUri);
  try {
    const user = await User.findOne({ emailNormalized: email });
    if (!user) throw new Error('Target account not found');
    if (user.accountState !== 'ACTIVE') throw new Error('Target account has not claimed its invitation; issue a new invitation link instead');
    if (user.role === 'SUPER_ADMIN' && (!secondApprover || secondApprover === operator)) {
      throw new Error('Super Admin recovery requires a distinct second approver');
    }
    const token = randomToken();
    await mongoose.connection.transaction(async (session) => {
      await User.updateOne({ _id: user._id }, { $set: { resetTokenDigest: digest(token), resetExpiresAt: new Date(Date.now() + 15 * 60_000) } }, { session });
      await AuthAudit.create([{ action: 'SUPPORT_RESET_ISSUED', actor: operator, targetUserId: user._id, method, secondApprover }], { session });
    });
    process.stdout.write(`One-use reset code for verified delivery: ${token}\n`);
  } finally { await mongoose.disconnect(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Recovery failed');
  process.exitCode = 1;
});
