import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 400 });

    // 1️⃣ Google Token prüfen
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const googleId = payload.sub;
    const email = payload.email;
    const username = payload.name || 'No Name';

    // 2️⃣ User in DB suchen
    const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = userResult.rows[0];

    // 3️⃣ Wenn User nicht existiert, per Email suchen
    if (!user) {
      const emailResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = emailResult.rows[0];

      // Existierender User → Google-ID verknüpfen
      if (user) {
        await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
      }
    }

    // 4️⃣ Wenn immer noch kein User → neu anlegen
    if (!user) {
      const insertResult = await pool.query(
        `INSERT INTO users (username, email, google_id, balance)
         VALUES ($1, $2, $3, 10000)
         RETURNING *`,
        [username, email, googleId]
      );
      user = insertResult.rows[0];
    }

    // 5️⃣ JWT erstellen
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    return NextResponse.json({ token: jwtToken, user });

  } catch (err) {
    console.error('Google login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
