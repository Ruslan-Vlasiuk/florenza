import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Checkbox webhook for receipt status updates (issued, failed, etc).
 * For now we just acknowledge — main flow generates receipts inline.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[checkbox webhook]', body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
