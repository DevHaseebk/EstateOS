import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';

// Phase 7a §3 test 1: a tiny in-process S3-compatible server (path-style PUT/GET/DELETE object, HEAD bucket).
// It refuses unsigned requests, so the real AWS SDK signing path is exercised. Synthetic data only; nothing leaves the machine.
export type FakeS3 = { endpoint: string; bucket: string; objects: Map<string, { body: Buffer; contentType: string }>; close: () => Promise<void> };

function readBody(request: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    request.on('data', (chunk: Buffer) => chunks.push(chunk)).on('end', () => resolve(Buffer.concat(chunks))).on('error', reject);
  });
}

export async function startFakeS3(bucket = 'estateos-test'): Promise<FakeS3> {
  const objects = new Map<string, { body: Buffer; contentType: string }>();
  const server: Server = createServer(async (request, response) => {
    if (!String(request.headers.authorization ?? '').startsWith('AWS4-HMAC-SHA256 ')) {
      response.writeHead(403, { 'content-type': 'application/xml' }).end('<Error><Code>AccessDenied</Code></Error>');
      return;
    }
    const url = new URL(request.url ?? '/', 'http://fake');
    const [, requestedBucket, ...rest] = url.pathname.split('/');
    if (requestedBucket !== bucket) {
      response.writeHead(404, { 'content-type': 'application/xml' }).end('<Error><Code>NoSuchBucket</Code></Error>');
      return;
    }
    const key = decodeURIComponent(rest.join('/'));
    if (!key && request.method === 'HEAD') { response.writeHead(200).end(); return; }
    if (request.method === 'PUT') {
      objects.set(key, { body: await readBody(request), contentType: String(request.headers['content-type'] ?? 'application/octet-stream') });
      response.writeHead(200, { etag: '"fake"' }).end();
    } else if (request.method === 'GET') {
      const object = objects.get(key);
      if (!object) { response.writeHead(404, { 'content-type': 'application/xml' }).end('<Error><Code>NoSuchKey</Code><Message>missing</Message></Error>'); return; }
      response.writeHead(200, { 'content-type': object.contentType, 'content-length': object.body.length }).end(object.body);
    } else if (request.method === 'DELETE') {
      objects.delete(key);
      response.writeHead(204).end();
    } else response.writeHead(405).end();
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return { endpoint: `http://127.0.0.1:${port}`, bucket, objects, close: () => new Promise((resolve) => server.close(() => resolve())) };
}
