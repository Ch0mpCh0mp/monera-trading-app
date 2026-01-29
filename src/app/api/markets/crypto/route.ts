// src/app/api/markets/crypto/route.ts
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano&sparkline=false'
    );
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Failed to fetch crypto via proxy:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
  }
}
