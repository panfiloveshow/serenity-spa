import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { request as httpsRequest } from 'node:https';
import { isIP } from 'node:net';
import path from 'node:path';
import { Readable } from 'node:stream';
import { checkServerIdentity } from 'node:tls';

export type PrivateRelayStatus = 'listed' | 'fallback' | 'none';

const FEED_URL = 'https://mask-api.icloud.com/egress-ip-ranges.csv';
const DAY_MS = 24 * 60 * 60 * 1000;
const RETRY_MS = 60 * 60 * 1000;
const DIRECT_FETCH_TIMEOUT_MS = 10_000;
const FETCH_TIMEOUT_MS = 60_000;
const MAX_FEED_BYTES = 32 * 1024 * 1024;
const MIN_FEED_ROWS = 1_000;

interface Address {
  version: 4 | 6;
  value: bigint;
}

interface RangeIndex {
  ipv4: Map<number, Set<bigint>>;
  ipv6: Map<number, Set<bigint>>;
  rows: number;
}

function parseAddress(address: string): Address | null {
  const version = isIP(address);
  if (version === 4) {
    let value = BigInt(0);
    for (const octet of address.split('.')) value = (value << BigInt(8)) | BigInt(Number(octet));
    return { version: 4, value };
  }
  if (version !== 6 || address.includes('%')) return null;

  // IPv6 can contain a dotted IPv4 tail, for example ::ffff:104.28.107.32.
  let expanded = address;
  if (expanded.includes('.')) {
    const colon = expanded.lastIndexOf(':');
    const tail = parseAddress(expanded.slice(colon + 1));
    if (!tail || tail.version !== 4) return null;
    const high = Number(tail.value >> BigInt(16)).toString(16);
    const low = Number(tail.value & BigInt(0xffff)).toString(16);
    expanded = `${expanded.slice(0, colon + 1)}${high}:${low}`;
  }

  const halves = expanded.split('::');
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves[1] ? halves[1].split(':') : [];
  const omitted = 8 - left.length - right.length;
  if (halves.length > 2 || omitted < 0 || (halves.length === 1 && omitted !== 0)) return null;
  const groups = [...left, ...Array(omitted).fill('0'), ...right];
  let value = BigInt(0);
  for (const group of groups) value = (value << BigInt(16)) | BigInt(parseInt(group, 16));
  return { version: 6, value };
}

function parseFeed(csv: string): RangeIndex {
  const index: RangeIndex = { ipv4: new Map(), ipv6: new Map(), rows: 0 };
  for (const line of csv.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const comma = trimmed.indexOf(',');
    if (comma < 0) throw new Error('Invalid Private Relay CSV row');
    const cidr = trimmed.slice(0, comma).replace(/^"|"$/g, '');
    const match = /^([^/]+)\/(\d{1,3})$/.exec(cidr);
    const address = match && parseAddress(match[1]);
    if (!match || !address) throw new Error('Invalid Private Relay network');
    const bits = address.version === 4 ? 32 : 128;
    const prefix = Number(match[2]);
    if (prefix < 1 || prefix > bits) throw new Error('Invalid Private Relay prefix');
    const networks = address.version === 4 ? index.ipv4 : index.ipv6;
    let entries = networks.get(prefix);
    if (!entries) networks.set(prefix, entries = new Set());
    entries.add(address.value >> BigInt(bits - prefix));
    index.rows++;
  }
  return index;
}

function normalizeMappedAddress(address: Address): Address {
  if (address.version === 6 && address.value >> BigInt(32) === BigInt(0xffff)) {
    return { version: 4, value: address.value & BigInt(0xffffffff) };
  }
  return address;
}

function matchesIndex(index: RangeIndex, address: Address): boolean {
  const networks = address.version === 4 ? index.ipv4 : index.ipv6;
  const bits = address.version === 4 ? 32 : 128;
  for (const [prefix, entries] of networks) {
    if (entries.has(address.value >> BigInt(bits - prefix))) return true;
  }
  return false;
}

function isCloudflareSafariFallback(address: Address, userAgent: string): boolean {
  if (address.version !== 4) return false;
  const cloudflare = (address.value >> BigInt(16)) === BigInt(0x681c) // 104.28.0.0/16
    || (address.value >> BigInt(19)) === (BigInt(0xac400000) >> BigInt(19)); // 172.64.0.0/13
  const appleDevice = /iPhone|iPad|iPod|Macintosh/i.test(userAgent);
  const safari = /AppleWebKit/i.test(userAgent) && /Safari/i.test(userAgent)
    && !/CriOS|FxiOS|EdgiOS|EdgA|Edg\/|OPiOS|OPR\/|Chrome|Chromium|Firefox|YaBrowser|DuckDuckGo|GSA\/|Vivaldi|Brave/i.test(userAgent);
  return cloudflare && appleDevice && safari;
}

async function readResponse(response: Response): Promise<string> {
  const length = Number(response.headers.get('content-length'));
  if (length > MAX_FEED_BYTES) throw new Error('Private Relay feed is too large');
  if (!response.body) throw new Error('Private Relay feed has no body');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FEED_BYTES) {
        await reader.cancel();
        throw new Error('Private Relay feed is too large');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, size).toString('utf8');
}

// Some networks block the Private Relay TLS server name. Connect to the same
// Apple feed using an Apple-owned TLS name, while routing the HTTP request to
// mask-api.icloud.com. The certificate chain and www.icloud.com identity are
// still verified; no third-party proxy or disabled certificate checks are used.
const fetchWithAppleAlternateName: typeof fetch = (_url, options) => new Promise((resolve, reject) => {
  const request = httpsRequest({
    hostname: 'mask-api.icloud.com',
    path: '/egress-ip-ranges.csv',
    method: 'GET',
    servername: 'www.icloud.com',
    headers: { host: 'mask-api.icloud.com' },
    signal: options?.signal ?? undefined,
    rejectUnauthorized: true,
    checkServerIdentity: (_hostname, certificate) => checkServerIdentity('www.icloud.com', certificate),
  }, response => {
    if (response.statusCode !== 200) {
      response.resume();
      reject(new Error(`Private Relay alternate feed HTTP ${response.statusCode ?? 'unknown'}`));
      return;
    }
    const headers = new Headers();
    if (response.headers['content-length']) headers.set('content-length', response.headers['content-length']);
    resolve(new Response(Readable.toWeb(response) as ReadableStream<Uint8Array>, {
      status: response.statusCode ?? 502,
      headers,
    }));
  });
  request.on('error', reject);
  request.end();
});

interface PrivateRelayListOptions {
  cachePath: string;
  minRows?: number;
  fetcher?: typeof fetch;
  alternateFetcher?: typeof fetch;
}

/** A last-known-good, disk-backed Apple feed with one background updater per process. */
export class PrivateRelayList {
  private index: RangeIndex | null = null;
  private lastSuccess = 0;
  private loadPromise: Promise<void> | null = null;
  private startPromise: Promise<void> | null = null;
  private refreshPromise: Promise<boolean> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly options: PrivateRelayListOptions) {}

  private ensureLoaded(): Promise<void> {
    if (!this.loadPromise) this.loadPromise = this.loadCache();
    return this.loadPromise;
  }

  private async loadCache(): Promise<void> {
    try {
      const stat = await fs.stat(this.options.cachePath);
      if (stat.size > MAX_FEED_BYTES) throw new Error('Private Relay cache is too large');
      const index = parseFeed(await fs.readFile(this.options.cachePath, 'utf8'));
      if (index.rows < (this.options.minRows ?? MIN_FEED_ROWS)) throw new Error('Private Relay cache is incomplete');
      this.index = index;
      this.lastSuccess = Math.min(stat.mtimeMs, Date.now());
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.warn('Could not load Private Relay cache:', error);
      }
    }
  }

  async classify(ip: string, userAgent: string): Promise<PrivateRelayStatus> {
    await this.ensureLoaded();
    const parsed = parseAddress(ip);
    if (!parsed) return 'none';
    const address = normalizeMappedAddress(parsed);
    if (this.index) return matchesIndex(this.index, address) ? 'listed' : 'none';
    return isCloudflareSafariFallback(address, userAgent) ? 'fallback' : 'none';
  }

  /** Refresh immediately; a failed or incomplete update never replaces the last good list. */
  async refresh(): Promise<boolean> {
    await this.ensureLoaded();
    if (!this.refreshPromise) {
      this.refreshPromise = this.fetchFeed().finally(() => { this.refreshPromise = null; });
    }
    return this.refreshPromise;
  }

  private async download(fetcher: typeof fetch, timeoutMs: number): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetcher(FEED_URL, { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error(`Private Relay feed HTTP ${response.status}`);
      return await readResponse(response);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async fetchFeed(): Promise<boolean> {
    let temporaryPath: string | null = null;
    try {
      let csv: string;
      try {
        csv = await this.download(this.options.fetcher ?? fetch, DIRECT_FETCH_TIMEOUT_MS);
      } catch (error) {
        const alternate = this.options.alternateFetcher ?? (this.options.fetcher ? undefined : fetchWithAppleAlternateName);
        if (!alternate) throw error;
        console.warn('Direct Private Relay feed unavailable; retrying through verified Apple TLS name');
        csv = await this.download(alternate, FETCH_TIMEOUT_MS);
      }
      const next = parseFeed(csv);
      if (next.rows < (this.options.minRows ?? MIN_FEED_ROWS)) {
        throw new Error('Private Relay feed is incomplete');
      }

      // Validate before publishing, and atomically replace the cache so readers
      // cannot observe a half-written file.
      try {
        await fs.mkdir(path.dirname(this.options.cachePath), { recursive: true });
        temporaryPath = `${this.options.cachePath}.${process.pid}.${randomUUID()}.tmp`;
        await fs.writeFile(temporaryPath, csv, { encoding: 'utf8', mode: 0o600 });
        await fs.rename(temporaryPath, this.options.cachePath);
        temporaryPath = null;
      } catch (error) {
        console.warn('Could not persist Private Relay cache:', error);
      }
      this.index = next;
      this.lastSuccess = Date.now();
      return true;
    } catch (error) {
      console.warn('Could not refresh Private Relay feed:', error);
      return false;
    } finally {
      if (temporaryPath) await fs.unlink(temporaryPath).catch(() => {});
    }
  }

  private schedule(delay: number): void {
    this.timer = setTimeout(() => {
      void this.refresh().then(success => this.schedule(success ? DAY_MS : RETRY_MS));
    }, delay);
    this.timer.unref?.();
  }

  /** Start at server boot, and retry failed updates hourly while serving the old list. */
  start(): Promise<void> {
    if (!this.startPromise) {
      this.startPromise = this.ensureLoaded().then(() => {
        this.schedule(this.index ? Math.min(DAY_MS, Math.max(0, this.lastSuccess + DAY_MS - Date.now())) : 0);
      });
    }
    return this.startPromise;
  }
}

// Next.js may bundle instrumentation and route modules separately; share one
// updater and its in-memory index across both bundles in the same Node process.
const GLOBAL_KEY = Symbol.for('serenity-spa.private-relay-list');
const globalStore = globalThis as unknown as Record<symbol, PrivateRelayList | undefined>;
const privateRelayList = globalStore[GLOBAL_KEY] ??= new PrivateRelayList({
  cachePath: process.env.ICLOUD_RELAY_CACHE_PATH || path.join(process.cwd(), '.cache', 'icloud-private-relay.csv'),
});

export function startPrivateRelayUpdater(): Promise<void> {
  return privateRelayList.start();
}

export async function getPrivateRelayStatus(ip: string, userAgent: string): Promise<PrivateRelayStatus> {
  await privateRelayList.start();
  return privateRelayList.classify(ip, userAgent);
}
