import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { readFile, readdir } from 'node:fs/promises';
import { makeServer } from '../server.js';

test('Pages security headers match the local server for every application asset', async t => {
  const config = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');
  const lines = config.trimEnd().split('\n');
  assert.equal(lines.shift(), '/*', 'One wildcard rule must cover every path');
  const headers = new Map(lines.map(line => {
    const match = /^ {2}([^:]+): (.+)$/.exec(line);
    assert.ok(match, 'Each header must use Pages header syntax');
    return [match[1].toLowerCase(), match[2]];
  }));
  assert.equal(headers.size, 5);
  for (const name of ['content-security-policy', 'x-content-type-options', 'referrer-policy', 'cache-control', 'permissions-policy']) {
    assert.ok(headers.has(name), `${name} must be configured`);
  }
  const server = makeServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => {
    server.closeAllConnections();
    return new Promise(resolve => server.close(resolve));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const path of ['/', '/index.html', '/app.js', '/app.css', '/curriculum.js', '/model.js', '/missing']) {
    const response = await fetch(`${base}${path}`);
    for (const [name, value] of headers) {
      assert.equal(value, response.headers.get(name), `${name} must match on ${path}`);
    }
    await response.arrayBuffer();
  }
});

test('Pages publish directory contains only static pilot assets and deployment controls', async () => {
  const files = await readdir(new URL('../public/', import.meta.url));
  assert.deepEqual(files.sort(), [
    '404.html', '_headers', 'app.css', 'app.js', 'curriculum.js', 'index.html', 'model.js',
  ]);
  const notFound = await readFile(new URL('../public/404.html', import.meta.url), 'utf8');
  assert.match(notFound, /<html lang="en">/);
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /href="\/app.css"/);
  assert.doesNotMatch(notFound, /<script\b/i);
});
