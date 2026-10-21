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

test('Phase 2a review routes are allow-listed per portal only', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const agencyId = 'a'.repeat(24);
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  try {
    const queue = await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/super-admin/review-queue?limit=5'), ctx(['super-admin', 'review-queue']));
    assert.equal(queue.status, 200);
    const detail = await superAdmin.GET(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${agencyId}`), ctx(['super-admin', 'agencies', agencyId]));
    assert.equal(detail.status, 200);
    for (const action of ['review-decisions', 'reopen']) {
      const response = await superAdmin.POST(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/${action}`, {
        method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
      }), ctx(['super-admin', 'agencies', agencyId, action]));
      assert.equal(response.status, 200, action);
    }
    const resubmit = await owner.POST(new NextRequest('https://admin.estateos.localhost/api/v1/owner/review-resubmissions', {
      method: 'POST', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'review-resubmissions']));
    assert.equal(resubmit.status, 200);
    const forwardedCount = forwarded.length;
    const ownerToQueue = await owner.GET(new NextRequest('https://admin.estateos.localhost/api/v1/super-admin/review-queue'), ctx(['super-admin', 'review-queue']));
    assert.equal(ownerToQueue.status, 404);
    const superToResubmit = await superAdmin.POST(new NextRequest('https://control.estateos.localhost/api/v1/owner/review-resubmissions', {
      method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'review-resubmissions']));
    assert.equal(superToResubmit.status, 404);
    const badId = await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/super-admin/agencies/not-an-id'), ctx(['super-admin', 'agencies', 'not-an-id']));
    assert.equal(badId.status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 2b directory and restriction routes are Super Admin only', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const agencyId = 'b'.repeat(24);
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  try {
    const list = await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/super-admin/agencies?q=test&review=APPROVED'), ctx(['super-admin', 'agencies']));
    assert.equal(list.status, 200);
    assert.match(forwarded.at(-1) ?? '', /\/api\/v1\/super-admin\/agencies\?q=test&review=APPROVED$/);
    const restrict = await superAdmin.POST(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/restrictions`, {
      method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['super-admin', 'agencies', agencyId, 'restrictions']));
    assert.equal(restrict.status, 200);
    const forwardedCount = forwarded.length;
    const ownerList = await owner.GET(new NextRequest('https://admin.estateos.localhost/api/v1/super-admin/agencies'), ctx(['super-admin', 'agencies']));
    assert.equal(ownerList.status, 404);
    const ownerRestrict = await owner.POST(new NextRequest(`https://admin.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/restrictions`, {
      method: 'POST', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['super-admin', 'agencies', agencyId, 'restrictions']));
    assert.equal(ownerRestrict.status, 404);
    const getRestrictions = await superAdmin.GET(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/restrictions`), ctx(['super-admin', 'agencies', agencyId, 'restrictions']));
    assert.equal(getRestrictions.status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 3a profile routes: GET and PUT on the owner portal only', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: { url: string; method?: string; body?: unknown }[] = [];
  globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => { forwarded.push({ url: String(input), method: init?.method, body: init?.body }); return Response.json({ data: {} }); };
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  try {
    const read = await owner.GET(new NextRequest('https://admin.estateos.localhost/api/v1/owner/profile'), ctx(['owner', 'profile']));
    assert.equal(read.status, 200);
    const save = await owner.PUT(new NextRequest('https://admin.estateos.localhost/api/v1/owner/profile', {
      method: 'PUT', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{"expectedProfileVersion":0}',
    }), ctx(['owner', 'profile']));
    assert.equal(save.status, 200);
    assert.equal(forwarded.at(-1)?.method, 'PUT');
    assert.equal(forwarded.at(-1)?.body, '{"expectedProfileVersion":0}');
    const forwardedCount = forwarded.length;
    const foreign = await owner.PUT(new NextRequest('https://admin.estateos.localhost/api/v1/owner/profile', {
      method: 'PUT', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'profile']));
    assert.equal(foreign.status, 403);
    const otherPut = await owner.PUT(new NextRequest('https://admin.estateos.localhost/api/v1/owner/session', {
      method: 'PUT', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'session']));
    assert.equal(otherPut.status, 404);
    const postProfile = await owner.POST(new NextRequest('https://admin.estateos.localhost/api/v1/owner/profile', {
      method: 'POST', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'profile']));
    assert.equal(postProfile.status, 404);
    const superProfile = await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/owner/profile'), ctx(['owner', 'profile']));
    assert.equal(superProfile.status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 3b website routes: owner GET/PUT and Super Admin GET only on their portal', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  const ownerPut = (path: string[]) => owner.PUT(new NextRequest(`https://admin.estateos.localhost/api/v1/${path.join('/')}`, {
    method: 'PUT', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
  }), ctx(path));
  const agencyId = 'c'.repeat(24);
  try {
    assert.equal((await owner.GET(new NextRequest('https://admin.estateos.localhost/api/v1/owner/website'), ctx(['owner', 'website']))).status, 200);
    assert.equal((await ownerPut(['owner', 'website', 'theme'])).status, 200);
    for (const section of ['header', 'hero', 'contact']) assert.equal((await ownerPut(['owner', 'website', 'sections', section])).status, 200, section);
    assert.equal((await superAdmin.GET(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/website`), ctx(['super-admin', 'agencies', agencyId, 'website']))).status, 200);
    const forwardedCount = forwarded.length;
    assert.equal((await ownerPut(['owner', 'website', 'sections', 'footer'])).status, 404);
    assert.equal((await ownerPut(['owner', 'website'])).status, 404);
    assert.equal((await owner.GET(new NextRequest(`https://admin.estateos.localhost/api/v1/super-admin/agencies/${agencyId}/website`), ctx(['super-admin', 'agencies', agencyId, 'website']))).status, 404);
    assert.equal((await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/owner/website'), ctx(['owner', 'website']))).status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 3c optional section and layout routes are owner-only PUTs', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  const put = (facade: typeof owner, host: string, path: string[]) => facade.PUT(new NextRequest(`https://${host}/api/v1/${path.join('/')}`, {
    method: 'PUT', headers: { origin: `https://${host}`, 'content-type': 'application/json' }, body: '{}',
  }), ctx(path));
  try {
    for (const section of ['about', 'services', 'whyChooseUs', 'team']) {
      assert.equal((await put(owner, 'admin.estateos.localhost', ['owner', 'website', 'sections', section])).status, 200, section);
    }
    assert.equal((await put(owner, 'admin.estateos.localhost', ['owner', 'website', 'layout'])).status, 200);
    const forwardedCount = forwarded.length;
    assert.equal((await put(owner, 'admin.estateos.localhost', ['owner', 'website', 'sections', 'footer'])).status, 404); // 'properties' became a real section in Phase 5a
    assert.equal((await put(owner, 'admin.estateos.localhost', ['owner', 'website', 'sections', 'faq'])).status, 404);
    assert.equal((await superAdmin.POST(new NextRequest('https://control.estateos.localhost/api/v1/owner/website/layout', {
      method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'website', 'layout']))).status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 4b publish route is an owner-only POST', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  try {
    const ok = await owner.POST(new NextRequest('https://admin.estateos.localhost/api/v1/owner/website/publish', {
      method: 'POST', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'website', 'publish']));
    assert.equal(ok.status, 200);
    const forwardedCount = forwarded.length;
    const viaPut = await owner.PUT(new NextRequest('https://admin.estateos.localhost/api/v1/owner/website/publish', {
      method: 'PUT', headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'website', 'publish']));
    assert.equal(viaPut.status, 404);
    const viaSuper = await superAdmin.POST(new NextRequest('https://control.estateos.localhost/api/v1/owner/website/publish', {
      method: 'POST', headers: { origin: 'https://control.estateos.localhost', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'website', 'publish']));
    assert.equal(viaSuper.status, 404);
    const foreign = await owner.POST(new NextRequest('https://admin.estateos.localhost/api/v1/owner/website/publish', {
      method: 'POST', headers: { origin: 'https://attacker.example', 'content-type': 'application/json' }, body: '{}',
    }), ctx(['owner', 'website', 'publish']));
    assert.equal(foreign.status, 403);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});

test('Phase 5a property routes: owner CRUD paths and Super Admin read-only list', async () => {
  const originalFetch = globalThis.fetch;
  const forwarded: string[] = [];
  globalThis.fetch = async (input: string | URL | Request) => { forwarded.push(String(input)); return Response.json({ data: {} }); };
  const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });
  const id = 'd'.repeat(24);
  const ownerReq = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string[]) => {
    const request = new NextRequest(`https://admin.estateos.localhost/api/v1/${path.join('/')}`, method === 'GET'
      ? undefined : { method, headers: { origin: 'https://admin.estateos.localhost', 'content-type': 'application/json' }, body: method === 'DELETE' ? undefined : '{}' });
    return owner[method](request, ctx(path));
  };
  try {
    assert.equal((await ownerReq('GET', ['owner', 'properties'])).status, 200);
    assert.equal((await ownerReq('GET', ['owner', 'properties', id])).status, 200);
    assert.equal((await ownerReq('POST', ['owner', 'properties'])).status, 200);
    assert.equal((await ownerReq('PUT', ['owner', 'properties', id])).status, 200);
    assert.equal((await ownerReq('POST', ['owner', 'properties', id, 'archive'])).status, 200);
    assert.equal((await ownerReq('POST', ['owner', 'properties', id, 'restore'])).status, 200);
    assert.equal((await ownerReq('PUT', ['owner', 'website', 'sections', 'properties'])).status, 200);
    assert.equal((await superAdmin.GET(new NextRequest(`https://control.estateos.localhost/api/v1/super-admin/agencies/${id}/properties`), ctx(['super-admin', 'agencies', id, 'properties']))).status, 200);
    const forwardedCount = forwarded.length;
    assert.equal((await ownerReq('DELETE', ['owner', 'properties', id])).status, 404);
    assert.equal((await ownerReq('POST', ['owner', 'properties', id, 'delete'])).status, 404);
    assert.equal((await ownerReq('GET', ['super-admin', 'agencies', id, 'properties'])).status, 404);
    assert.equal((await superAdmin.GET(new NextRequest('https://control.estateos.localhost/api/v1/owner/properties'), ctx(['owner', 'properties']))).status, 404);
    assert.equal(forwarded.length, forwardedCount);
  } finally { globalThis.fetch = originalFetch; }
});
