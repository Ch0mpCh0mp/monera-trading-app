import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': process.env.NEXT_PUBLIC_GOLDAPI_KEY!,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    return new Response(JSON.stringify({
      name: 'Gold (XAU/USD)',
      symbol: 'XAUUSD',
      price: data.price ?? 0,
      changePct: data.chp ?? 0,
      trend: data.chp > 0 ? 'up' : data.chp < 0 ? 'down' : 'neutral',
      image: '/gold.png'
    }), { status: 200 });

  } catch (err) {
    console.error('Gold fetch failed', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch gold' }), { status: 500 });
  }
}
