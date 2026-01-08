'use client';

import Logo from '../components/Logo';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center gap-2 text-center bg-neutral-800/30 w-full max-w-sm p-6 border border-white/10 rounded-xl shadow-md">
        {/* Logo and Header */}
        <header className="flex flex-col items-center gap-2 mb-4">
          <Logo size={64} aria-label="Monera Trading Logo" />
          <h1 className="text-3xl font-bold mt-3 text-gray-100">
            Monera Trading
          </h1>
          <p className="text-gray-500">Your Paper Trading Simulator</p>
        </header>

        {/* Mode Toggle */}
        <nav
          aria-label="Authentication mode"
          className="w-full gap-1 grid grid-cols-2 p-0.5 rounded-lg bg-white/10"
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            aria-pressed={mode === 'login'}
            className={`h-9 w-full rounded-lg text-sm transition
    ${mode === 'login' ? 'bg-black/70 text-white/60' : 'text-neutral-300'}
  `}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            aria-pressed={mode === 'register'}
            className={`h-9 w-full rounded-lg text-sm transition
    ${mode === 'register' ? 'bg-black/70 text-white/60' : 'text-neutral-300'}
  `}
          >
            Register
          </button>
        </nav>

        {/* Auth Form */}
        <form
          className="w-full mt-4 flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);

            // passwörter stimmen überein?
            if (mode === 'register' && password !== confirmPassword) {
              setError('Passwords do not match');
              return;
            }

            // ist was eingetragen?
            if (!email || !password) {
              setError('Please fill in all fields');
              return;
            }

            // weg machen wenn ich backend habe
            console.log({
              mode,
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
            });
          }}
        >
          {mode === 'register' && (
            <>
              <div className="w-full text-left space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-white/80 block"
                >
                  First name
                </label>

                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="h-11 w-full rounded-xl bg-black/30 border border-white/10 px-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:ring-4 focus:ring-white/10"
                />
              </div>

              <div className="w-full text-left space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-white/80 block"
                >
                  Last name
                </label>

                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="h-11 w-full rounded-xl bg-black/30 border border-white/10 px-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:ring-4 focus:ring-white/10"
                />
              </div>
            </>
          )}

          <div className="w-full text-left space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-white/80 block"
            >
              Email
            </label>

            <div className="w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10">
              <span className="grid place-items-center text-white/40">
                <Mail size={18} />
              </span>

              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3"
              />
            </div>
          </div>

          <div className="w-full text-left space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-white/80"
            >
              Password
            </label>

            <div className="w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10">
              <span className="grid place-items-center text-white/40">
                <Lock size={18} />
              </span>

              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3"
                placeholder="Your password"
              />
            </div>

            {mode === 'register' && (
              <div className="w-full text-left space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-white/80"
                >
                  Confirm Password
                </label>

                <div className="w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10">
                  <span className="grid place-items-center text-white/40">
                    <Lock size={18} />
                  </span>

                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="h-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Fehlermeldung */}
          {error && <p className="text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="mt-2 mb-2">
            <button
              type="submit"
              className="w-full rounded-lg h-9 text-black text-base bg-green-600 "
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-white/30 text-sm">
          Demo account with $10,000 starting balance
        </p>
      </section>
    </main>
  );
}
