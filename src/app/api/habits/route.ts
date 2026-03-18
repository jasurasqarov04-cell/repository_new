import { NextRequest, NextResponse } from 'next/server'
import { buildDashboard } from '@/lib/services/dashboard-service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('uid') ?? undefined
    const data   = await buildDashboard(userId)
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[api/habits]', err)
    return NextResponse.json(
      { error: 'Failed to load habits data', detail: String(err) },
      { status: 500 },
    )
  }
}
