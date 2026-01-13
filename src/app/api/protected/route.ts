import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

export async function authenticate(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number };
    if (!payload?.userId) return null;

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const user = result.rows[0];

    return user || null;
  } catch (err) {
    console.error('JWT auth error:', err);
    return null;
  }
}

// Wrapper für API-Routen
export async function requireAuth(req: NextRequest, callback: (user: any) => Promise<NextResponse>) {
  const user = await authenticate(req);
  if (!user) {
    // Hier erzeugen wir eine Instanz von NextResponse
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return callback(user);
}
