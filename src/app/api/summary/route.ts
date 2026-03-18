import { NextRequest, NextResponse } from 'next/server'
import { buildDashboard } from '@/lib/services/dashboard-service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('uid') ?? undefined
    const data   = await buildDashboard(userId)

    // Return only summary-level data (lighter payload)
    return NextResponse.json({
      dailySummaries:   data.dailySummaries.slice(-30),
      weeklySummaries:  data.weeklySummaries.slice(-12),
      monthlySummaries: data.monthlySummaries,
      globalStreak:     data.globalStreak,
      generatedAt:      data.generatedAt,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
