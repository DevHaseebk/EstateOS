import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { AuthAudit, User } from '../models.js';
import { hashPassword, normalizeEmail, validatePassword } from '../security.js';

async function main(): Promise<void> {
  const name = process.env.BOOTSTRAP_NAME?.trim();
  const email = process.env.BOOTSTRAP_EMAIL ? normalizeEmail(process.env.BOOTSTRAP_EMAIL) : undefined;
  const password = process.env.BOOTSTRAP_PASSWORD;
  const operator = process.env.BOOTSTRAP_OPERATOR?.trim();
  if (!env.mongoUri || !name || !email || !password || !operator || !validatePassword(password, [name, email])) {
    throw new Error('Mongo URI, operator, name, email and strong environment-provided password are required');
  }
  await mongoose.connect(env.mongoUri);
  try {
    await Promise.all([User.init(), AuthAudit.init()]);
    const passwordHash = await hashPassword(password);
    await mongoose.connection.transaction(async (session) => {
      if (await User.exists({ role: 'SUPER_ADMIN' }).session(session)) throw new Error('Super Admin bootstrap already completed');
      const [user] = await User.create([{ role: 'SUPER_ADMIN', name, emailNormalized: email, passwordHash, bootstrapKey: 'FIRST_SUPER_ADMIN' }], { session });
      await AuthAudit.create([{ action: 'FIRST_SUPER_ADMIN_BOOTSTRAP', actor: operator, targetUserId: user._id }], { session });
    });
    process.stdout.write('First Super Admin created and audited.\n');
  } finally { await mongoose.disconnect(); }
}
void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Bootstrap failed');
  process.exitCode = 1;
});
