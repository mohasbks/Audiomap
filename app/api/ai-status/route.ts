import { NextResponse } from 'next/server';
import { checkGroqStatus } from '@/lib/groq';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await checkGroqStatus(), { headers: { 'Cache-Control': 'no-store' } });
}
