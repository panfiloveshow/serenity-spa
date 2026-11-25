import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

const canonical = 'https://serenityspa.uz';
const base = new URL(process.argv[2] || canonical);
const local = base.hostname !== 'serenityspa.uz';
const appOrigin = local ? base.origin : canonical;
let checks = 0;

async function get(path, { www = false, http = false } = {}) {
  const origin = local ? base.origin : `${http ? 'http' : 'https'}://${www ? 'www.' : ''}serenityspa.uz`;
  if (local && www) {
    // Node fetch normalizes Host to the URL's host; use core HTTP to exercise
    // the real www host rules against a local production server.
    const request = base.protocol === 'https:' ? httpsRequest : httpRequest;
    return new Promise((resolve, reject) => {
      const req = request(new URL(path, origin), { headers: { Host: 'www.serenityspa.uz' } }, incoming => {
        const chunks = [];
        incoming.on('data', chunk => chunks.push(chunk));
        incoming.on('error', reject);
        incoming.on('end', () => resolve(new Response(Buffer.concat(chunks), {
          status: incoming.statusCode,
          headers: Object.entries(incoming.headers).filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value]),
        })));
      });
      req.setTimeout(15000, () => req.destroy(new Error('Request timed out')));
      req.on('error', reject);
      req.end();
    });
  }
  const response = await fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
  });
  return response;
}

async function redirect(path, destination, options) {
  const response = await get(path, options);
  assert.ok([301, 308].includes(response.status), `${path}: expected permanent redirect, got ${response.status}`);
  const origin = options?.www ? `${options.http ? 'http' : 'https'}://www.serenityspa.uz`
    : options?.http && !local ? 'http://serenityspa.uz' : base.origin;
  const location = response.headers.get('location');
  assert.ok(location, `${path}: missing Location header`);
  assert.equal(new URL(location, origin).href, destination, `${path}: redirect must reach the canonical destination directly`);
  await response.body?.cancel();
  checks++;
}

function checkInternalLinks(html, path) {
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (href.startsWith('#')) continue;
    const url = new URL(href, `${canonical}${path}`);
    if (!['serenityspa.uz', 'www.serenityspa.uz'].includes(url.hostname)) continue;
    assert.equal(url.hostname, 'serenityspa.uz', `Internal www link: ${href}`);
    assert.ok(/^\/(ru|en|uz)(\/|$)/.test(url.pathname) || url.pathname.includes('.'), `Internal link missing locale: ${href}`);
  }
}

const listedServices = ['spa-packages-tashkent', 'spa-with-pool-tashkent', 'massage-tashkent', 'wellness-membership-tashkent'];
await redirect('/ru', `${canonical}/ru`, { www: true });
for (const slug of listedServices) {
  await redirect(`/ru/services/${slug}`, `${canonical}/ru/services/${slug}`, { www: true });
  await redirect(`/services/${slug}`, `${appOrigin}/ru/services/${slug}`);
  await redirect(`/services/${slug}`, `${canonical}/ru/services/${slug}`, { www: true });
}
for (const www of [false, true]) {
  await redirect('/', `${www ? canonical : appOrigin}/ru`, { www });
  if (!local) await redirect('/', `${canonical}/ru`, { www, http: true });
}
await redirect('/?gclid=test&utm_source=qa', `${canonical}/ru?gclid=test&utm_source=qa`, { www: true });

for (const prefix of ['', '/ru', '/en', '/uz']) {
  for (const [route, asset] of [['opengraph-image', 'og-image.jpg'], ['twitter-image', 'og-image.jpg'], ['icon', 'icon.png'], ['apple-icon', 'icon.png']]) {
    await redirect(`${prefix}/${route}`, `${canonical}/${asset}`);
    await redirect(`${prefix}/${route}?v=1`, `${canonical}/${asset}?v=1`, { www: true });
  }
}
for (const asset of ['/og-image.jpg', '/icon.png']) {
  const response = await get(asset);
  assert.equal(response.status, 200, asset);
  assert.ok(response.headers.get('content-type')?.startsWith('image/'), `${asset}: expected an image`);
  await response.body?.cancel();
  checks++;
}

for (const lang of ['ru', 'en', 'uz']) {
  for (const page of ['privacy', 'terms']) {
    const path = `/${lang}/${page}`;
    const response = await get(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    for (const name of ['robots', 'googlebot']) {
      const robots = html.match(new RegExp(`<meta name="${name}" content="([^"]+)"`))?.[1];
      assert.ok(robots?.includes('noindex') && robots.includes('follow'), `${path}: missing ${name} noindex, follow`);
    }
    checks++;
  }
  const response = await get(`/${lang}`);
  assert.equal(response.status, 200, lang);
  const html = await response.text();
  checkInternalLinks(html, `/${lang}`);
  checks++;
}

const sitemapResponse = await get('/sitemap.xml');
assert.equal(sitemapResponse.status, 200);
const xml = await sitemapResponse.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(urls.length, 36, 'Sitemap must contain only 3 homepages and 33 service pages');
for (const url of urls) {
  assert.match(url, /^https:\/\/serenityspa\.uz\/(ru|en|uz)(\/services\/[a-z-]+)?$/);
  const response = await get(new URL(url).pathname);
  assert.equal(response.status, 200, url);
  const html = await response.text();
  assert.ok(html.includes(`rel="canonical" href="${url}"`), `${url}: incorrect canonical`);
  assert.doesNotMatch(html, /<meta name="robots" content="[^"]*noindex/, `${url}: indexable page marked noindex`);
  checkInternalLinks(html, new URL(url).pathname);
  checks++;
}
for (const path of ['/llms.txt', '/services.md', '/pricing.md', '/robots.txt']) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path} must remain accessible`);
  await response.body?.cancel();
  checks++;
}
console.log(`${checks} indexing checks passed for ${base.origin}${local ? ' (HTTP/nginx layer is not covered by this local run)' : ''}`);
