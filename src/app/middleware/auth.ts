import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

export async function authenticate(req: NextRequest) {
  console.log('Authenticate aufgerufen')
  try {
    // JWT aus Header auslesen
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) return null;

    // Token prüfen
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number };

    if (!payload?.userId) return null;

    // User aus DB laden
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const user = result.rows[0];

    return user || null;
  } catch (err) {
    console.error('JWT auth error:', err);
    return null;
  }
}

// Middleware für API-Routen
export async function requireAuth(req: NextRequest, res: NextResponse, callback: (user: any) => Promise<NextResponse>) {
  console.log('Require Auth')

  const user = await authenticate(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return callback(user);
}
