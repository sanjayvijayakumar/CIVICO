import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { makeServer } from '../server.js';

test('static server exposes only application assets with privacy and security headers', async t => {
  const server = makeServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    return new Promise(resolve => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  await t.test('HTML is available and scripts are external modules', async () => {
    const response = await fetch(base);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.match(response.headers.get('content-security-policy'), /connect-src 'none'/);
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.match(response.headers.get('permissions-policy'), /microphone=\(\)/);
    assert.equal(response.headers.get('set-cookie'), null);
    const html = await response.text();
    assert.match(html, /Sound, Music, and Meaning/);
    assert.match(html, /type="module" src="\/app.js"/);
    assert.doesNotMatch(html, /<script[^>]*>[^<\s]/);
  });

  await t.test('all module and style assets are served with correct MIME types', async () => {
    for (const path of ['/app.js', '/model.js', '/curriculum.js', '/app.css']) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), path.endsWith('.css') ? /text\/css/ : /text\/javascript/);
      assert.ok((await response.text()).length > 0);
    }
  });

  await t.test('HEAD returns headers without a body', async () => {
    const response = await fetch(base, { method: 'HEAD' });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    assert.equal(await response.text(), '');
  });

  await t.test('non-application files and traversal attempts are unavailable', async () => {
    for (const path of ['/server.js', '/package.json', '/.git/config', '/docs/01_philosophy/01_what_is_value.md', '/%2e%2e/server.js', '/..%2fserver.js', '/api/journal']) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 404, path);
    }
  });

  await t.test('there is no form submission or write endpoint', async () => {
    for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
      const response = await fetch(base, { method, body: 'not-saved' });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get('allow'), 'GET, HEAD');
    }
  });
});

test('client uses no persistent storage, dynamic HTML insertion, or network APIs', async () => {
  const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /localStorage|sessionStorage|indexedDB|document\.cookie|innerHTML|outerHTML|insertAdjacentHTML|fetch\(|XMLHttpRequest|sendBeacon|WebSocket/);
  assert.match(app, /node\.textContent = text/);
  assert.match(app, /exportPortfolio\(session\)/);
  assert.match(app, /addEventListener\('pagehide'/);
});
