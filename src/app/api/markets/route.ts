import { NextResponse } from 'next/server'
import { getMarkets } from './_lib/marketsCache'
import { fetchCrypto, fetchStocks, fetchGoldAPI } from './_lib/markets'

export async function GET() {
  try {
    // Markets aus dem Cache holen (Crypto + Stocks)
    const [ crypto, stocks, gold ] = await Promise.all([
      fetchCrypto(),
      fetchStocks(),
      fetchGoldAPI(),
    ])

//Gold zu Stocks hinufügen
const allStocks = [...stocks, gold]


console.log('API MARKETS LIVE:', { crypto, stocks: allStocks}) 
    // JSON zurückgeben
    return NextResponse.json({ crypto, stocks: allStocks })
  } catch (err: any) {
    console.error('Markets API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch markets data' },
      { status: 500 }
    )
  }
}
