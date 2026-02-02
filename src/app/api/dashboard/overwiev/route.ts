import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/middleware/auth';
import pool from '@/app/db/client'; //  DB-Client


      export async function GET(req: NextRequest) {
  return requireAuth(req, async (user) => {
    const userResult = await pool.query(
      'SELECT id, username, email, balance FROM users WHERE id = $1',
      [user.id]
    );
    const dbUser = userResult.rows[0];

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ordersResult = await pool.query(
      'SELECT COUNT(*) AS totalOrders, COALESCE(SUM(total),0) AS totalSpent FROM orders WHERE user_id = $1',
      [user.id]
    );
    const totalOrders = parseInt(ordersResult.rows[0].totalorders, 10);
    const totalSpent = parseFloat(ordersResult.rows[0].totalspent);

    return NextResponse.json({
      user: {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
      },
      balance: parseFloat(dbUser.balance),
      totalOrders,
      totalSpent,
    });
  });
}
