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
        console.log('Google Login OK:', data);

        // TODO: Token speichern + Redirect
        // localStorage.setItem('token', data.token);
        // router.push('/dashboard');
      } catch (err) {
        console.error('Google login error', err);
        setError('Google authentication failed');
      }
    };

    return () => {
      document.body.removeChild(script);
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

    const endpoint =
      mode === 'login'
        ? '/api/auth/login'
        : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Auth Error:', res.status, text);
        setError('Authentication failed');
        return;
      }

      const data = await res.json();
      console.log('Email Auth OK:', data);

      // TODO: Token speichern + Redirect
    } catch (err) {
      console.error('Email auth error', err);
      setError('Authentication failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900">
      <section className="flex flex-col items-center gap-2 text-center bg-neutral-800/30 w-full max-w-sm p-6 border border-white/10 rounded-xl shadow-md">

        {/* Logo */}
        <header className="flex flex-col items-center gap-2 mb-4">
          <Logo size={64} />
          <h1 className="text-3xl font-bold text-gray-100">Monera Trading</h1>
          <p className="text-gray-500">Your Paper Trading Simulator</p>
        </header>

        {/* Mode Toggle */}
        <nav className="w-full grid grid-cols-2 gap-1 p-1 bg-white/10 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={mode === 'login' ? 'bg-black/70 rounded-lg' : ''}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={mode === 'register' ? 'bg-black/70 rounded-lg' : ''}
          >
            Register
          </button>
        </nav>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="w-full mt-4 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-black/30"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-black/30"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-green-600 rounded p-2">
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Google */}
        <div
          id="g_id_onload"
          data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          data-callback="handleGoogleLogin"
        />
        <div className="g_id_signin" />

        {/* Test Button */}
        <button
          type="button"
          onClick={() => {
            console.log('Fake Google Login OK');
            alert('Fake Google Login simuliert (Frontend OK)');
          }}
          className="mt-3 text-sm text-blue-400"
        >
          Test Google Login
        </button>

        <p className="text-white/30 text-sm mt-2">
          Demo account with $10,000 starting balance
        </p>
      </section>
    </main>
  );
}
