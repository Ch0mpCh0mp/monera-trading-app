import axios from 'axios'

// 1️⃣ Crypto: Coingecko API
export async function fetchCrypto() {
  const res = await axios.get(
    'https://api.coingecko.com/api/v3/coins/markets',
    {
      params: {
        vs_currency: 'usd',
        per_page: 10,
        order: 'market_cap_desc'
      }
    }
  )
  return res.data
}

// 2️⃣ Aktien: Alpha Vantage (kostenlos, API Key nötig)
export async function fetchStocks() {
  const symbols = ['AAPL', 'TSLA', 'MSFT']
  const apiKey = process.env.ALPHA_VANTAGE_KEY || ''

  return Promise.all(
    symbols.map(async symbol => {
      const res = await axios.get(
        'https://www.alphavantage.co/query',
        {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol,
            apikey: apiKey
          }
        }
      )
      return res.data['Global Quote']
    })
  )
}
