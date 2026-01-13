import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/app/db/client';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // 1️⃣ Prüfen, ob User schon existiert
    const { rows: existingRows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [emailLower]
    );

    if (existingRows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 2️⃣ Passwort hashen
    const password_hash = await bcrypt.hash(password, 10);

    // 3️⃣ User in DB anlegen
    const { rows } = await pool.query(
      'INSERT INTO users (email, username, password_hash, balance) VALUES ($1, $2, $3, $4) RETURNING *',
      [emailLower, `${firstName} ${lastName}`, password_hash, 10000]
    );

    const user = rows[0];

    // 4️⃣ JWT erstellen
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

