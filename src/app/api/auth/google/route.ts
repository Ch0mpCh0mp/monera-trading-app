import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // 1️⃣ Google Token prüfen
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const username = payload.name || 'No Name';

    // 2️⃣ User in DB suchen
    const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = userResult.rows[0];

    // 3️⃣ User erstellen, falls nicht gefunden
    if (!user) {
      const insertResult = await pool.query(
        'INSERT INTO users (google_id, email, username, balance) VALUES ($1, $2, $3, $4) RETURNING *',
        [googleId, email, username, 10000]
      );
      user = insertResult.rows[0];
    }

    // 4️⃣ JWT erstellen
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token: jwtToken, user });
  } catch (err) {
    console.error('Google login error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}
