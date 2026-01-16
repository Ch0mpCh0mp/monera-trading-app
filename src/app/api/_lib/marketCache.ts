import { fetchCrypto, fetchStocks, Crypto, Stock } from './markets'

interface Cache {
  crypto: Crypto[] | null
  stocks: Stock[] | null
  timestamp: number
}

const cache: Cache = {
  crypto: null,
  stocks: null,
  timestamp: 0,
}

const CACHE_TTL = 1000 * 60 * 1 // 1 Minute

export async function getMarkets() {
  const now = Date.now()

  if (cache.crypto && cache.stocks && now - cache.timestamp < CACHE_TTL) {
    return { crypto: cache.crypto, stocks: cache.stocks }
  }

  const crypto = await fetchCrypto()
  const stocks = await fetchStocks()

  cache.crypto = crypto
  cache.stocks = stocks
  cache.timestamp = now

  return { crypto, stocks }
}
