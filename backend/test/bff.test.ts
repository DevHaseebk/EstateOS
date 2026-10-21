import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import { NextRequest } from 'next/server';

process.env.INTERNAL_API_KEY = 'test-internal-api-key-with-at-least-thirty-two-characters';
let owner: typeof import('../../admin/app/api/v1/[...path]/route.ts');
let superAdmin: typeof import('../../super-admin/app/api/v1/[...path]/route.ts');
before(async () => {
  owner = await import('../../admin/app/api/v1/[...path]/route.ts');
  superAdmin = await import('../../super-admin/app/api/v1/[...path]/route.ts');
});

test('owner facade sets a host-only secure HttpOnly cookie and strips internal token', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ data: { user: { role: 'AGENCY_OWNER' } }, internal: { sessionToken: 'synthetic-session-token' } });
  try {
    const request = new NextRequest('https://admin.estateos.localhost/api/v1/owner/sessions', {
      method: 'POST', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'synthetic@example.test', password: 'synthetic' }),
    });
    const response = await owner.POST(request, { params: Promise.resolve({ path: ['owner', 'sessions'] }) });
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie') ?? '';
    assert.match(cookie, /__Host-estateos_owner=/);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /SameSite=lax/i);
    assert.doesNotMatch(cookie, /Domain=/i);
    assert.deepEqual(await response.json(), { data: { user: { role: 'AGENCY_OWNER' } } });
  } finally { globalThis.fetch = originalFetch; }
});

test('foreign Origin and cross-portal route are rejected before backend forwarding', async () => {
  const foreign = new NextRequest('https://admin.estateos.localhost/api/v1/owner/sessions', {
    method: 'POST', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' }, body: '{}',
  });
  const originResponse = await owner.POST(foreign, { params: Promise.resolve({ path: ['owner', 'sessions'] }) });
  assert.equal(originResponse.status, 403);
  const crossPortal = new NextRequest('https://admin.estateos.localhost/api/v1/super-admin/session');
  const crossResponse = await owner.GET(crossPortal, { params: Promise.resolve({ path: ['super-admin', 'session'] }) });
  assert.equal(crossResponse.status, 404);
});

test('Super Admin facade uses a separate cookie', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ data: { user: { role: 'SUPER_ADMIN' } }, internal: { sessionToken: 'synthetic-super-token' } });
  try {
    const request = new NextRequest('https://control.estateos.localhost/api/v1/super-admin/sessions', {
      method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    });
    const response = await superAdmin.POST(request, { params: Promise.resolve({ path: ['super-admin', 'sessions'] }) });
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie') ?? '';
    assert.match(cookie, /__Host-estateos_super=/);
    assert.doesNotMatch(cookie, /__Host-estateos_owner=/);
    assert.match(cookie, /Secure/i);
    assert.doesNotMatch(cookie, /Domain=/i);
  } finally { globalThis.fetch = originalFetch; }
});
