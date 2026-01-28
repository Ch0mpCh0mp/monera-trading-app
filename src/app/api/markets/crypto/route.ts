// Proxy für CoinGecko Crypto API
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&order=market_cap_desc'
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Failed to fetch crypto via proxy:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
  }
}
