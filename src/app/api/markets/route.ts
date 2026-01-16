import { NextResponse } from 'next/server'
import { getMarkets } from './_lib/marketsCache'

export async function GET() {
  try {
    // Markets aus dem Cache holen (Crypto + Stocks)
    const { crypto, stocks } = await getMarkets()

    // JSON zurückgeben
    return NextResponse.json({ crypto, stocks })
  } catch (err: any) {
    console.error('Markets API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch markets data' },
      { status: 500 }
    )
  }
}
