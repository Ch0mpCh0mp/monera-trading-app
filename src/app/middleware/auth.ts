import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

/**
 * Prüft den JWT-Token im Authorization-Header
 * @param req NextRequest
 * @returns User-Objekt aus DB oder null
 */
export async function authenticate(req: NextRequest) {
  console.log('[Auth Middleware] Authenticate aufgerufen');

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('[Auth Middleware] Kein Bearer-Token gefunden');
      return null;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('[Auth Middleware] Token leer');
      return null;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number };
    if (!payload?.userId) {
      console.log('[Auth Middleware] Kein userId im Token');
      return null;
    }

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [payload.userId]);
    const user = result.rows[0];

    if (!user) {
      console.log('[Auth Middleware] User nicht gefunden');
      return null;
    }

    return user;
  } catch (err) {
    console.error('[Auth Middleware] JWT auth error:', err);
    return null;
  }
}

/**
 * Wrapper für geschützte API-Routen
 * @param req NextRequest
 * @param callback Callback mit User
 */
export async function requireAuth(
  req: NextRequest,
  callback: (user: any) => Promise<NextResponse>
) {
  console.log('[Auth Middleware] Require Auth aufgerufen');

  const user = await authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return callback(user);
}
