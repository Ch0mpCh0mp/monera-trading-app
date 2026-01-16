import axios from 'axios'

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
  const res = await axios.get<Crypto[]>(
    'https://api.coingecko.com/api/v3/coins/markets',
    {
      params: {
        vs_currency: 'usd',
        per_page: 10,
        order: 'market_cap_desc',
      },
    }
  )
  return res.data
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
    const res = await axios.get<AlphaVantageResponse>(
      'https://www.alphavantage.co/query',
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: apiKey,
        },
      }
    )

    stocks.push(res.data['Global Quote'])
  }

  return stocks
}
