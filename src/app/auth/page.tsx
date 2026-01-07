'use client';

import Logo from '../components/Logo';
import { useState } from 'react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center gap-2 text-center w-full max-w-sm p-6 border rounded-xl shadow-md">
        {/* Logo and Header */}
        <header>
          <Logo size={64} aria-label="Monera Trading Logo" />
          <h1>Monera Trading</h1>
          <p>Your Paper Trading Simulator</p>
        </header>

        {/* Mode Toggle */}
        <nav
          aria-label="Authentication mode"
          className="w-full gap-2 grid grid-cols-2 p-2 rounded-xl border bg-neutral-600/40"
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            aria-pressed={mode === 'login'}
            className={`h-10 rounded-lg text-sm font-semibold transition
    ${mode === 'login' ? 'bg-black/70 text-white' : 'text-neutral-300'}
  `}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            aria-pressed={mode === 'register'}
            className={`h-10 rounded-lg text-sm font-semibold transition
    ${mode === 'register' ? 'bg-black/70 text-white' : 'text-neutral-300'}
  `}
          >
            Register
          </button>
        </nav>

        {/* Auth Form */}
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            if (!email || !password) {
              setError('Please fill in all fields');
              return;
            }

            // weg machen wenn ich backend habe
            console.log({ mode, email, password });
          }}
        >
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Fehlermeldung */}
          {error && <p className="text-sm">{error}</p>}

          {/* Submit Button */}
          <div>
            <button type="submit">Login</button>
          </div>
        </form>

        <p>Demo account with $10,000 starting balance</p>
      </section>
    </main>
  );
}
