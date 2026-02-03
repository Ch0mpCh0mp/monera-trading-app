// src/app/api/markets/_lib/markets.ts

// Crypto Typ
export interface Crypto {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  image: string
}

// Crypto fetchen
export async function fetchCrypto(): Promise<Crypto[]> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&order=market_cap_desc'
  )
  return await res.json()
}

// Stock Typ
export interface Stock {
  '01. symbol': string
  '05. price': string
  '10. change percent': string
}

// Alpha Vantage Response Typ
interface AlphaVantageResponse {
  'Global Quote': Stock
}

// Stocks fetchen
export async function fetchStocks(): Promise<Stock[]> {
  const symbols = ['AAPL', 'TSLA', 'MSFT']
  const apiKey = process.env.ALPHA_VANTAGE_KEY || ''

  const stocks: Stock[] = []

  for (const symbol of symbols) {
    const res = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    )
    const data: AlphaVantageResponse = await res.json()
    stocks.push(data['Global Quote'])
  }

  return stocks
}
