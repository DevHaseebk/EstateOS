import { NextRequest, NextResponse } from 'next/server';

const PORTAL = 'OWNER';
const ORIGIN = process.env.OWNER_ORIGIN ?? 'https://admin.estateos.test';
const COOKIE = '__Host-estateos_owner';
const PREAUTH = '__Host-estateos_preauth_owner';

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = `/api/v1/${path.join('/')}`;
  const allowed = (request.method === 'GET' && (route === '/api/v1/auth/csrf' || route === '/api/v1/owner/session' || /^\/api\/v1\/owner\/agencies\/[a-f0-9]{24}$/i.test(route))) ||
    (request.method === 'POST' && ['/api/v1/owner/registrations', '/api/v1/owner/sessions', '/api/v1/auth/recovery/complete'].includes(route)) ||
    (request.method === 'DELETE' && route === '/api/v1/owner/session');
  if (!allowed) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Not found' } }, { status: 404 });
  const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
  if (unsafe && (request.headers.get('origin') !== ORIGIN || request.headers.get('sec-fetch-site') === 'cross-site')) {
    return NextResponse.json({ error: { code: 'ORIGIN_REJECTED', message: 'Origin is not allowed' } }, { status: 403 });
  }
  const key = process.env.INTERNAL_API_KEY;
  if (!key || key.length < 32) return NextResponse.json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Authentication is unavailable' } }, { status: 503 });
  if (process.env.NODE_ENV === 'production' && !process.env.TRUSTED_CLIENT_IP_HEADER) {
    return NextResponse.json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Trusted ingress IP configuration is required' } }, { status: 503 });
  }
  const api = process.env.BACKEND_INTERNAL_URL ?? 'http://127.0.0.1:4003';
  const headers = new Headers({ 'x-internal-api-key': key, 'x-portal': PORTAL, 'x-client-ip': 'unknown' });
  const trustedIpHeader = process.env.TRUSTED_CLIENT_IP_HEADER;
  if (trustedIpHeader) headers.set('x-client-ip', request.headers.get(trustedIpHeader) ?? 'unknown');
  for (const name of ['origin', 'sec-fetch-site', 'content-type', 'x-csrf-token']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const session = request.cookies.get(COOKIE)?.value;
  const preauth = request.cookies.get(PREAUTH)?.value;
  if (session) headers.set('x-session-token', session);
  if (preauth) headers.set('x-preauth-nonce', preauth);
  let upstream: Response;
  try {
    upstream = await fetch(`${api}${route}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: unsafe && request.method !== 'DELETE' ? await request.text() : undefined,
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    return NextResponse.json({ error: { code: 'AUTH_UNAVAILABLE', message: 'Authentication is unavailable' } }, { status: 503 });
  }
  const body = upstream.status === 204 ? null : await upstream.json().catch(() => null);
  const response = upstream.status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(body?.internal ? { data: body.data } : body, { status: upstream.status });
  response.headers.set('Cache-Control', 'no-store');
  const retryAfter = upstream.headers.get('retry-after');
  if (retryAfter) response.headers.set('Retry-After', retryAfter);
  if (body?.internal?.preauthNonce && route === '/api/v1/auth/csrf') {
    response.cookies.set(PREAUTH, body.internal.preauthNonce, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 1200 });
  }
  if (body?.internal?.sessionToken && route === '/api/v1/owner/sessions') {
    response.cookies.set(COOKIE, body.internal.sessionToken, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 });
    response.cookies.set(PREAUTH, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  }
  if (upstream.ok && route === '/api/v1/owner/session' && request.method === 'DELETE') {
    response.cookies.set(COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
  }
  return response;
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
