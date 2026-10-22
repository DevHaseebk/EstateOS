import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { randomBytes } from 'node:crypto';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Phase 7a §3 test 5 (D-112): encrypted backup → restore round-trip and every refusal. Synthetic records only (D-116).
let mongo: MongoMemoryReplSet;
let models: typeof import('../src/models.js');
let backup: typeof import('../src/backup.js');
const key = randomBytes(32);
const { EJSON } = mongoose.mongo.BSON;

before(async () => {
  models = await import('../src/models.js');
  backup = await import('../src/backup.js');
  mongo = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  await mongoose.connect(mongo.getUri('estateos-source'));
  await Promise.all([models.Agency.init(), models.User.init(), models.AgencyAudit.init(), models.WebsiteDraft.init(), models.PublishedRevision.init(), models.Property.init(), models.Media.init()]);
  const [agency] = await models.Agency.create([{ name: 'Synthetic Backup Homes', mobileE164: '+923001234567', whatsappE164: '+923007654321', origin: 'ADMIN_CREATED' }]);
  await models.User.create({ role: 'AGENCY_OWNER', agencyId: agency!._id, name: 'Synthetic Owner', emailNormalized: 'backup-owner@example.test', passwordHash: 'synthetic-hash' });
  await models.User.create({ role: 'AGENCY_OWNER', name: 'Invited Owner', emailNormalized: 'invited@example.test', accountState: 'INVITED', inviteTokenDigest: 'a'.repeat(64), inviteExpiresAt: new Date('2030-01-01T00:00:00Z') });
  await models.AgencyAudit.create({ agencyId: agency!._id, actorRole: 'SYSTEM', axis: 'PUBLICATION', action: 'WEBSITE_FIRST_LIVE', fromStatus: 'NEVER_PUBLISHED', toStatus: 'LIVE' });
  await mongoose.connection.db!.collection('properties').insertOne({ agencyId: agency!._id, title: 'Synthetic flat', pricePkr: 12_500_000, createdAt: new Date('2026-10-01T10:00:00Z'), photos: [] });
  await mongoose.connection.db!.collection('media').insertOne({ mediaId: 'b'.repeat(32), agencyId: agency!._id, purpose: 'HERO', status: 'ATTACHED', variants: [{ width: 480, key: 'variants/x/480.webp', bytes: 10 }] });
});
after(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });

async function snapshot(db: mongoose.mongo.Db) {
  const result: Record<string, { documents: string; indexes: string[] }> = {};
  for (const { name } of (await db.listCollections({}, { nameOnly: true }).toArray()).sort((a, b) => a.name.localeCompare(b.name))) {
    const collection = db.collection(name);
    result[name] = {
      documents: EJSON.stringify(await collection.find({}).sort({ _id: 1 }).toArray(), { relaxed: false }),
      indexes: (await collection.indexes()).map((index) => `${index.name}:${JSON.stringify(index.key)}:${index.unique ? 'u' : ''}${index.sparse ? 's' : ''}${index.partialFilterExpression ? 'p' : ''}`).sort(),
    };
  }
  return result;
}
const target = (name: string) => mongoose.connection.getClient().db(name);

test('backup → restore into an empty database gives identical documents and indexes; the header holds no data', async () => {
  const source = mongoose.connection.db!;
  const { file, header } = await backup.createBackup(source, key, new Date('2026-10-22T12:00:00Z'));
  assert.equal(header.createdAt, '2026-10-22T12:00:00.000Z');
  assert.ok(header.collections.some((entry) => entry.name === 'agencyaudits' && entry.count === 1));
  assert.equal(file.includes(Buffer.from('Synthetic Backup Homes')), false, 'the data is encrypted');
  assert.equal(file.includes(Buffer.from('backup-owner@example.test')), false);
  const restored = await backup.restoreBackup(file, key, target('estateos-restored'));
  assert.deepEqual(restored, header);
  assert.deepEqual(await snapshot(target('estateos-restored')), await snapshot(source));
  // The restored audit is still append-only through the model's hooks.
  const RestoredAudit = mongoose.connection.useDb('estateos-restored').model('AgencyAudit', models.AgencyAudit.schema);
  await assert.rejects(RestoredAudit.updateOne({}, { $set: { reason: 'changed' } }), /AUDIT_APPEND_ONLY/);
});

test('wrong key, a changed byte in the body or header, and a non-empty target are refused before any write', async () => {
  const { file } = await backup.createBackup(mongoose.connection.db!, key);
  const fresh = target('estateos-refusals');
  await assert.rejects(backup.restoreBackup(file, randomBytes(32), fresh), /wrong key, or the file was changed/);
  const body = Buffer.from(file);
  body[body.length - 5] ^= 0x01;
  await assert.rejects(backup.restoreBackup(body, key, fresh), /changed or damaged/);
  const headerTampered = Buffer.from(file);
  headerTampered[10] = headerTampered[10] === 0x61 ? 0x62 : 0x61;
  await assert.rejects(backup.restoreBackup(headerTampered, key, fresh), backup.BackupError);
  assert.deepEqual(await fresh.listCollections().toArray(), [], 'nothing was written');
  const busy = target('estateos-busy');
  await busy.collection('agencies').insertOne({ name: 'Existing synthetic data' });
  await assert.rejects(backup.restoreBackup(file, key, busy), /not empty/);
  assert.equal(await busy.collection('agencies').countDocuments(), 1);
  assert.deepEqual((await busy.listCollections().toArray()).map((entry) => entry.name), ['agencies']);
});

test('the key must be 32 bytes; the source database is recognised as the restore target', () => {
  assert.equal(backup.parseBackupKey('ab'.repeat(32)).length, 32);
  assert.equal(backup.parseBackupKey(randomBytes(32).toString('base64')).length, 32);
  for (const bad of [undefined, '', 'short', 'ab'.repeat(31)]) assert.throws(() => backup.parseBackupKey(bad), /32 bytes/);
  assert.equal(backup.sameDatabase('mongodb+srv://user:pw@cluster0.example.net/estateos?retryWrites=true', 'mongodb+srv://other:pw@Cluster0.example.net/estateos'), true);
  assert.equal(backup.sameDatabase('mongodb+srv://u:p@cluster0.example.net/estateos', 'mongodb+srv://u:p@cluster0.example.net/estateos-restore-drill'), false);
  assert.equal(backup.sameDatabase('mongodb://127.0.0.1:27017/a', 'mongodb://127.0.0.1:27017/b'), false);
});
