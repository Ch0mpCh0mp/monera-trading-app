import { NextResponse } from 'next/server'
import { getMarkets } from '../_lib/marketCache'

export async function GET() {
  try {
    const { crypto, stocks } = await getMarkets()
    return NextResponse.json({ crypto, stocks })
  } catch (err: any) {
    console.error('Markets API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch markets data' },
      { status: 500 }
    )
  }
}
