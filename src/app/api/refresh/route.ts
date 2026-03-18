import { NextRequest, NextResponse } from 'next/server'
import { buildDashboard } from '@/lib/services/dashboard-service'

export const dynamic = 'force-dynamic'

/**
 * POST /api/refresh  — force-fetches fresh data, bypassing any ISR cache.
 */
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json().catch(() => ({}))
    const userId = body.uid ?? req.nextUrl.searchParams.get('uid') ?? undefined
    const data   = await buildDashboard(userId)
    return NextResponse.json(
      { ok: true, data, refreshedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    console.error('[api/refresh]', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
