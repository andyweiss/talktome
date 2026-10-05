const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const https = require('node:https');
const selfsigned = require('selfsigned');
const { mkdtempSync, writeFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { spawn } = require('node:child_process');
const { io } = require('socket.io-client');
const { Server } = require('socket.io');
const { normalizeWebAccess, resolveWebAccess, createWebServer, requestConnectOrigin } = require('./webAccess');

test('web access defaults, environment precedence and validation', () => {
  assert.equal(resolveWebAccess({}, {}).tlsMode, 'internal');
  const active = resolveWebAccess({ tlsMode: 'internal', httpsPort: 8443 }, { TALKTOME_TLS_MODE: 'proxy', PORT: '8080' });
  assert.equal(active.tlsMode, 'proxy');
  assert.equal(active.httpsPort, 8080);
  assert.deepEqual(active.environmentOverrides, ['tlsMode', 'httpsPort']);
  for (const config of [{ tlsMode: 'off' }, { httpsPort: 0 }, { httpsPort: 1.5 }, { publicUrl: 'http://example.com' }, { publicUrl: 'https://user:pass@example.com' }, { publicUrl: 'https://example.com/path' }, { trustedProxies: 'invalid' }]) {
    assert.throws(() => normalizeWebAccess(config));
  }
});

test('forwarded origins are accepted only from allowlisted peers', () => {
  const access = resolveWebAccess({ trustedProxies: '10.0.0.2' }, {});
  const req = { socket: { remoteAddress: '10.0.0.3' }, headers: { host: 'backend:8443', 'x-forwarded-host': 'talktome.example.com', 'x-forwarded-proto': 'https' } };
  assert.equal(requestConnectOrigin(req, access), 'http://backend:8443');
  req.socket.remoteAddress = '10.0.0.2';
  assert.equal(requestConnectOrigin(req, access), 'https://talktome.example.com');
  req.headers['x-forwarded-proto'] = 'javascript';
  assert.equal(requestConnectOrigin(req, access), '');
});

function request(client, port, path = '/') {
  return new Promise((resolve, reject) => {
    client.get({ hostname: '127.0.0.1', port, path, rejectUnauthorized: false, agent: false }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    }).on('error', reject);
  });
}

for (const mode of ['internal', 'proxy']) {
  test(`${mode} serves app and Socket.IO with the selected transport`, async () => {
    const certs = mode === 'internal' ? selfsigned.generate([{ name: 'commonName', value: 'localhost' }], { keySize: 2048, days: 1 }) : null;
    const access = resolveWebAccess({ tlsMode: mode }, {});
    const server = createWebServer((req, res) => {
      res.end(req.url === '/login/options' ? JSON.stringify({ guestLogin: { enabled: false } }) : 'app');
    }, access, () => {
      assert.equal(mode, 'internal', 'HTTP mode must not read certificates');
      return { key: certs.private, cert: certs.cert };
    }, 'localhost');
    const sockets = new Server(server);
    sockets.on('connection', socket => socket.emit('ready', 'connected'));
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    let client;
    const dir = mkdtempSync(join(tmpdir(), 'talktome-healthcheck-'));
    try {
      const response = await request(mode === 'proxy' ? http : https, port, '/admin');
      assert.equal(response.status, 200);
      assert.equal(response.body, 'app');

      client = io(`${mode === 'proxy' ? 'http' : 'https'}://127.0.0.1:${port}`, { rejectUnauthorized: false, transports: ['websocket'], reconnection: false });
      assert.equal(await new Promise((resolve, reject) => {
        client.on('ready', resolve);
        client.on('connect_error', reject);
        setTimeout(() => reject(new Error('Socket.IO timeout')), 3000).unref();
      }), 'connected');
      writeFileSync(join(dir, 'config.json'), JSON.stringify({ tlsMode: mode, httpsPort: port }));
      const env = { ...process.env, TALKTOME_DATA_DIR: dir };
      for (const key of ['PORT', 'HTTPS_PORT', 'TALKTOME_TLS_MODE']) delete env[key];
      const healthcheck = spawn(process.execPath, [join(__dirname, 'containerHealthcheck.js')], { env });
      assert.equal(await new Promise((resolve, reject) => {
        healthcheck.on('error', reject);
        healthcheck.on('exit', resolve);
      }), 0, 'healthcheck must use the saved mode and port');
    } finally {
      rmSync(dir, { recursive: true, force: true });
      client?.close();
      await new Promise(resolve => sockets.close(resolve));
    }
  });
}
