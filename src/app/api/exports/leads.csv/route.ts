import { NextRequest, NextResponse } from 'next/server';
import { buildLeadsCsv, verifyExportRequestToken } from '@/lib/integrations/csv-export';
import { getLeadsStore } from '@/lib/leads/store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = verifyExportRequestToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const leads = await getLeadsStore().listLeads();
  const csv = buildLeadsCsv(leads);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
