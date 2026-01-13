import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/middleware/auth';
import pool from '@/app/db/client';

export async function POST(req: NextRequest) {
  const res = NextResponse.next();

  return requireAuth(req, res, async (user) => {
    console.log('USER FROM TOKEN:', user); // Debug: prüfe ob JWT korrekt geparst wird

    try {
      // Body aus Postman lesen
      const body = await req.json();
      console.log('Body received:', body);

      const { amount, type } = body;
      console.log('Amount:', amount, 'Type:', type);

      if (!amount || !type) {
        return NextResponse.json(
          { error: 'Missing amount or type' },
          { status: 400 }
        );
      }

      // 1️⃣ Check if user has enough balance
      const userResult = await pool.query(
        'SELECT balance FROM users WHERE id = $1',
        [user.id]
      );

      if (userResult.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const balance = parseFloat(userResult.rows[0].balance);

      if (balance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      // 2️⃣ Insert trade
      const tradeResult = await pool.query(
        'INSERT INTO trades (user_id, amount, type) VALUES ($1, $2, $3) RETURNING id, amount, type, pnl, created_at',
        [user.id, amount, type]
      );

      // 3️⃣ Update user balance
      const newBalance = balance - amount;
      await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, user.id]);

      // 4️⃣ Return JSON
      return NextResponse.json({
        trade: tradeResult.rows[0],
        balance: newBalance,
      });
    } catch (err) {
      console.error('Trade POST error:', err);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  });
}
