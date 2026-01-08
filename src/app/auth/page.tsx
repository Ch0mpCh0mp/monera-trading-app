'use client';

import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { Mail, Lock } from 'lucide-react';

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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Google One Tap Script laden
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Callback für Google Login
    window.handleGoogleLogin = async (response: GoogleCredentialResponse) => {
      const token = response.credential;
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('HTTP Error:', res.status, text);
          return;
        }

        const data = await res.json();
        console.log('Google Backend Response:', data);

        // TODO: JWT speichern und Weiterleitung ins Dashboard
        // localStorage.setItem('token', data.token);
        // router.push('/dashboard');
      } catch (err) {
        console.error('Google login error', err);
      }
    };

    // Cleanup beim Unmount
    return () => {
      document.body.removeChild(script);
      // TypeScript-konformer Delete-Operator
      window.handleGoogleLogin = undefined;
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mode }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('HTTP Error:', res.status, text);
        setError('Authentication failed');
        return;
      }

      const data = await res.json();
      console.log('Email Backend Response:', data);

      // TODO: JWT speichern und Weiterleitung ins Dashboard
    } catch (err) {
      console.error('Email login error', err);
      setError('Authentication failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <section className="flex flex-col items-center gap-2 text-center bg-neutral-800/30 w-full max-w-sm p-6 border border-white/10 rounded-xl shadow-md">
        {/* Logo & Header */}
        <header className="flex flex-col items-center gap-2 mb-4">
          <Logo size={64} aria-label="Monera Trading Logo" />
          <h1 className="text-3xl font-bold mt-3 text-gray-100">Monera Trading</h1>
          <p className="text-gray-500">Your Paper Trading Simulator</p>
        </header>

        {/* Mode Toggle */}
        <nav className="w-full gap-1 grid grid-cols-2 p-0.5 rounded-lg bg-white/10" aria-label="Authentication mode">
          <button
            type="button"
            onClick={() => setMode('login')}
            aria-pressed={mode === 'login'}
            className={`h-9 w-full rounded-lg text-sm transition ${mode === 'login' ? 'bg-black/70 text-white/60' : 'text-neutral-300'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            aria-pressed={mode === 'register'}
            className={`h-9 w-full rounded-lg text-sm transition ${mode === 'register' ? 'bg-black/70 text-white/60' : 'text-neutral-300'}`}
          >
            Register
          </button>
        </nav>

        {/* Auth Form */}
        <form className="w-full mt-4 flex flex-col gap-4" onSubmit={handleEmailSubmit} noValidate>
          {/* Email */}
          <div className="w-full text-left space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white/80 block">Email</label>
            <div className="w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10">
              <span className="grid place-items-center text-white/40"><Mail size={18} /></span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3"
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full text-left space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white/80">Password</label>
            <div className="w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10">
              <span className="grid place-items-center text-white/40"><Lock size={18} /></span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="h-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" className="w-full mt-2 mb-2 rounded-lg h-9 text-black text-base bg-green-600">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Google One Tap */}
        <div id="g_id_onload" data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} data-callback="handleGoogleLogin"></div>
        <div className="g_id_signin" data-type="standard"></div>

       
       <p className="text-white/30 text-sm mt-2">Demo account with $10,000 starting balance</p>
      {/* Test Button für Fake Google Login */}
<button
  type="button"
  onClick={() => {
    const fakeResponse = { credential: 'FAKE_TOKEN_FOR_TESTING' };
    console.log('Simulierter Google Login:', fakeResponse);
    setError(null);
    alert('Fake Google Login simuliert – kein Backend-Aufruf.');
  }}
>
  Test Google Login
</button>

</section>
    </main>
  );
}
