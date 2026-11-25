import type { GeoInfo } from './geoip';
import type { PrivateRelayStatus } from './private-relay';

// An IP database's generic "hosting" bit can also be set for consumer ISPs.
// Only treat an identified cloud or data-centre operator as hosting.
const LOCAL_OPERATOR = /\b(?:uzbektelekom|uztelecom|unitel|beeline|ucell|coscom|uzmobile|perfectum|turon\s+telecom|sarkor(?:\s+telecom)?|tps|evo|comnet)\b/i;
const LOCAL_ASNS = new Set(['8193', '28910', '41202', '59668']);
const HOSTING_PROVIDER = /\b(?:amazon\s+(?:web\s+services|data\s+services|technologies)|aws|google\s+cloud|microsoft\s+azure|azure|digitalocean|hetzner|ovh|contabo|cloudflare|akamai|vultr|linode|akamai\s+connected\s+cloud|oracle\s+cloud)\b/i;
const HOSTING_ASNS = new Set(['16509', '14618', '396982', '8075', '14061', '24940', '16276', '51167', '13335', '20940', '16625']);

function networkDetails(geo: GeoInfo): string {
  return [geo.isp, geo.org, geo.asName].filter(Boolean).join(' ');
}

function networkAsn(geo: GeoInfo): string | undefined {
  return /\bAS\s*(\d+)\b/i.exec(geo.asName)?.[1];
}

export function isHostingProvider(geo: GeoInfo): boolean {
  const details = networkDetails(geo);
  const asn = networkAsn(geo);
  if (LOCAL_OPERATOR.test(details) || (asn && LOCAL_ASNS.has(asn))) return false;
  return HOSTING_PROVIDER.test(details) || Boolean(asn && HOSTING_ASNS.has(asn))
    || (geo.hosting && /\b(?:google\s+llc|microsoft\s+corporation)\b/i.test(details));
}

export function isLikelyPrivateRelay(geo: GeoInfo, userAgent: string, status?: PrivateRelayStatus): boolean {
  if (status === 'listed' || status === 'fallback') return true;
  const appleDevice = /iPhone|iPad|iPod|Macintosh/i.test(userAgent);
  const safari = /AppleWebKit/i.test(userAgent) && /Safari/i.test(userAgent)
    && !/CriOS|FxiOS|EdgiOS|EdgA|Edg\/|OPiOS|OPR\/|Chrome|Chromium|Firefox|YaBrowser|DuckDuckGo|GSA\/|Vivaldi|Brave/i.test(userAgent);
  const details = networkDetails(geo);
  const asn = networkAsn(geo);
  const relayProvider = /\b(?:cloudflare|akamai)\b/i.test(details)
    || Boolean(asn && ['13335', '20940', '16625'].includes(asn));
  return appleDevice && safari && relayProvider;
}
