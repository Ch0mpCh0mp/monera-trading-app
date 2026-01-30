import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOLD_API_KEY;
  console.log("GoldAPI Key:", process.env.GOLD_API_KEY);


  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gold API key missing' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
      method: 'GET',
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: 'GoldAPI error', details: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      name: 'Gold (XAU/USD)',
      symbol: 'XAUUSD',
      price: data.price,
      change: data.ch,
      changePct: data.chp,
      high: data.high_price,
      low: data.low_price,
      open: data.open_price,
      trend:
        data.ch > 0
          ? 'up'
          : data.ch < 0
          ? 'down'
          : 'neutral',
      image: '/gold.png',
      source: 'goldapi'
    });

  } catch (error) {
    console.error('Gold API fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gold price' },
      { status: 500 }
    );
  }
}
