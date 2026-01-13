import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/middleware/auth';
import pool from '@/app/db/client';

export async function GET(req: NextRequest) {
  // requireAuth prüft JWT und gibt User weiter
  return requireAuth(req, async (user) => {
    try {
      // Alle Trades des Users aus der DB holen
      const { rows } = await pool.query(
        `SELECT id, amount, type, pnl, created_at
         FROM trades
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [user.id]
      );

      return NextResponse.json({ trades: rows });
    } catch (err) {
      console.error('[Trade History] Error fetching trade history:', err);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
