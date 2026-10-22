// Phase 3d §4: public images. Proxies the backend PUBLIC portal (images in the current Live revision only); no cookies.
export async function GET(_request: Request, context: { params: Promise<{ mediaId: string; width: string }> }) {
  const { mediaId, width } = await context.params;
  if (!/^[a-f0-9]{32}$/.test(mediaId) || !/^\d{2,4}$/.test(width)) return new Response('Not found', { status: 404 });
  const key = process.env.PUBLIC_API_KEY;
  if (!key || key.length < 32) return new Response('Unavailable', { status: 503 });
  const api = process.env.API_URL ?? 'http://127.0.0.1:4003';
  const upstream = await fetch(`${api}/api/v1/public/media/${mediaId}/${width}`, { headers: { 'x-public-api-key': key }, cache: 'no-store', signal: AbortSignal.timeout(8000) })
    .catch(() => null);
  if (!upstream?.ok || !upstream.headers.get('content-type')?.startsWith('image/')) return new Response('Not found', { status: 404 });
  return new Response(await upstream.arrayBuffer(), { status: 200, headers: {
    'Content-Type': upstream.headers.get('content-type')!, 'Cache-Control': upstream.headers.get('cache-control') ?? 'public, max-age=300', 'X-Content-Type-Options': 'nosniff',
  } });
}
