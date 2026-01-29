import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const symbols = ['AAPL', 'TSLA', 'AMZN']; // Neue Aktien
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_KEY!;
    const stockPromises = symbols.map(async (symbol) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      const data = await res.json();
      return {
        name: symbol,
        symbol: symbol,
        price: Number(data.c),
        changePct: ((data.c - data.pc) / data.pc) * 100,
        trend: data.c - data.pc > 0 ? 'up' : data.c - data.pc < 0 ? 'down' : 'neutral',
      };
    });

    const stocks = await Promise.all(stockPromises);
    return new Response(JSON.stringify(stocks), { status: 200 });
  } catch (err) {
    console.error('Failed to fetch stocks via proxy:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch stocks' }), { status: 500 });
  }
}
