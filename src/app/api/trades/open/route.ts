import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/middleware/auth';
import pool from '@/app/db/client';
export async function POST(req: NextRequest) {
  try {
    // Prüfen, ob überhaupt JSON kommt
    const text = await req.text();
    console.log('Raw body:', text);

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    console.log('Parsed body:', body);

    const { amount, type } = body;

    if (!amount || !type) {
      return NextResponse.json({ error: 'Missing amount or type' }, { status: 400 });
    }

    // Middleware aufrufen
    return await requireAuth(req, async (user) => {
      console.log('Authenticated user:', user);

      const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [user.id]);
      const balance = parseFloat(userResult.rows[0].balance);

      if (balance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      const tradeResult = await pool.query(
        'INSERT INTO trades (user_id, amount, type) VALUES ($1, $2, $3) RETURNING id, amount, type, pnl, created_at',
        [user.id, amount, type]
      );

      const newBalance = balance - amount;
      await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, user.id]);

      return NextResponse.json({
        trade: tradeResult.rows[0],
        balance: newBalance,
      });
    });
  } catch (err) {
    console.error('POST /trades/open error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
