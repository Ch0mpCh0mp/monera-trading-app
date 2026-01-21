import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '@/app/db/client';

export async function POST(req: NextRequest) {
  console.log('Login augerufen');
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1️⃣ User aus DB holen
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = rows[0];

    console.log('User from DB:', user);

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }


    // 2️⃣ Passwort prüfen
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3️⃣ JWT erstellen
    // 3️⃣ JWT erstellen
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);

// Nur sichere Felder zurückgeben
const safeUser = {
  id: user.id,
  email: user.email,
  username: user.username,
  balance: user.balance,
};

return NextResponse.json({ token: token, user: safeUser });



  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

