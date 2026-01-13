'use client';

import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GoogleCredentialResponse {
  credential: string;
  clientId?: string;
}

// Globale Typisierung für window
declare global {
  interface Window {
    handleGoogleLogin?: (response: GoogleCredentialResponse) => void;
  }
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Google One Tap Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleGoogleLogin = async (response: GoogleCredentialResponse) => {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: response.credential }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('Google Auth Error:', res.status, text);
          setError('Google authentication failed');
          return;
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } catch (err) {
        console.error('Google login error', err);
        setError('Google authentication failed');
      }
    };

    return () => {
      document.body.removeChild(script);
      window.handleGoogleLogin = undefined;
    };
  }, [router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (mode === 'register' && (!firstName || !lastName || !confirmPassword))) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(mode === 'login' ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email, password }
            : { email, password, firstName, lastName }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // Token + User speichern
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/dashboard');
    } catch (err) {
      console.error('Email auth error', err);
      setError('Authentication failed');
    }
  };

  return (
    <main className="min-h-screen px-4 flex items-center justify-center">
      <section className="flex flex-col items-center gap-2 text-center bg-neutral-800/30 w-full max-w-sm p-6 border border-white/10 rounded-xl shadow-md">

        {/* Logo */}
        <header className="flex flex-col items-center gap-2 mb-4">
          <Logo size={64} />
          <h1 className="text-3xl font-bold text-gray-100">Monera Trading</h1>
          <p className="text-gray-500">Your Paper Trading Simulator</p>
        </header>

        {/* Mode Toggle */}
        <nav className="w-full grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-lg">
          <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? 'bg-black/70 rounded-lg' : ''}>Login</button>
          <button type="button" onClick={() => setMode('register')} className={mode === 'register' ? 'bg-black/70 rounded-lg' : ''}>Register</button>
        </nav>

        {/* Auth Form */}
        <form
          className="w-full mt-4 flex flex-col gap-4"
          noValidate
          onSubmit={(e) => {
            handleEmailSubmit(e);
          }}
        >
          {mode === 'register' && (
            <>
              {/* VORNAME */}
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

              {/* NACHNAME */}
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
          
          {/* EMAIL */}
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

          {/* PASSWORT */}
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

            {/* BESTÄTIGE PASSWORT */}
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
        
       {/* Google Login */}
        <div id="g_id_onload" data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} data-callback="handleGoogleLogin" />
        <div className="g_id_signin" />
        
        {/* HINWEIS STARTGUTHABEN */}
        <p className="text-white/30 text-sm">
          Demo account with $10,000 starting balance
        </p>
      </section>
    </main>
  );
}
