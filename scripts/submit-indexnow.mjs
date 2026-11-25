import assert from 'node:assert/strict';

const HOST = 'serenityspa.uz';
const SITE_URL = `https://${HOST}`;
const INDEXNOW_KEY = '7f4c9e2a8b1d6035e9c4a2f817d3b6e0';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const LOCALES = ['ru', 'en', 'uz'];
const ORGANIC_SLUGS = [
  'massage-tashkent',
  'balinese-massage-tashkent',
  'lymphatic-drainage-massage-tashkent',
  'couples-spa-tashkent',
  'gift-certificate-spa-tashkent',
  'body-wrap-tashkent',
  'pool-day-pass-tashkent',
  'spa-with-pool-tashkent',
  'sauna-hammam-tashkent',
  'spa-packages-tashkent',
  'wellness-membership-tashkent',
];

const URL_LIST = [
  ...LOCALES.flatMap((lang) => [
    `${SITE_URL}/${lang}`,
    ...ORGANIC_SLUGS.map((slug) => `${SITE_URL}/${lang}/services/${slug}`),
  ]),
  `${SITE_URL}/llms.txt`,
  `${SITE_URL}/services.md`,
  `${SITE_URL}/pricing.md`,
];

const payload = {
  host: HOST,
  key: INDEXNOW_KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST,
};

if (process.argv.includes('--dry-run')) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.exit(0);
}

const keyCheck = await fetch(KEY_LOCATION, { signal: AbortSignal.timeout(15000) });
assert.equal(keyCheck.status, 200, `IndexNow key file ${KEY_LOCATION} returned ${keyCheck.status}`);
const keyBody = (await keyCheck.text()).trim();
assert.equal(keyBody, INDEXNOW_KEY, `IndexNow key file content mismatch at ${KEY_LOCATION}`);

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow',
];

const results = [];
for (const endpoint of ENDPOINTS) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });
  const text = await response.text();
  assert.ok(
    response.status === 200 || response.status === 202,
    `IndexNow endpoint ${endpoint} failed with HTTP ${response.status}: ${text}`,
  );
  results.push({ endpoint, status: response.status });
}

console.log(
  JSON.stringify(
    {
      submittedUrls: URL_LIST.length,
      keyLocation: KEY_LOCATION,
      results,
    },
    null,
    2,
  ),
);
