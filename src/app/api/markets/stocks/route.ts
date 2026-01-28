import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // deine Stocks API URL
    const res = await fetch('DEINE_STOCKS_API_URL');
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.error('Failed to fetch stocks via proxy:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
  }
}
