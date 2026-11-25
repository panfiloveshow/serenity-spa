import type { NextRequest } from 'next/server';
import { handleGoogleAdsCsvRequest } from '@/lib/integrations/csv-export';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleGoogleAdsCsvRequest(request);
}
