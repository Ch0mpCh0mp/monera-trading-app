'use client';

import { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';
import { Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

// GOOGLE EIGENES OBJEKT
interface GoogleCredentialResponse {
  credential: string;
  clientId?: string;
}

// DAMIT TS NICHT MECKERT WEIL GOOGLE DAS SELBER INJIZIERT
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (opts: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;

          renderButton: (
            parent: HTMLElement,
            opts: Record<string, any>
          ) => void;
        };
      };
    };
  }
}

export default function AuthPage() {
  const router = useRouter();

  // LOGIN ODER REGISTRIEREN
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // FORMULAR EINGABEN
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // FEHLERANZEIGE AUS DEN APIS
  const [error, setError] = useState<string | null>(null);

  // FÜR DAS RESPONSIVE RENDERN DEs GOOGLE BUTTONS
  const googleWrapRef = useRef<HTMLDivElement | null>(null); // CONTAINER DESSEN BREITE WIR MESSEN
  const googleBtnRef = useRef<HTMLDivElement | null>(null); // DIV IN DIE GOOGLE RENDERT

  // VERHINDERT MEHRFACHES INITIALISIEREN DES SCRIPTS
  const googleInitRef = useRef(false);

  // TAILWIND KLASSEN ALS KONSTANTE DAMIT ES ÜBERSICHTLICHER BLEIBT
  const labelCls = 'text-sm font-medium text-white/80 block';
  const fieldCls = 'w-full text-left space-y-2';
  const shellCls =
    'w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10';
  const inputCls =
    'h-full w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3';

  useEffect(() => {
    // SCRIPT DYNAMISCH LADEN ABER NUR WENN ES NOCH NICHT EXISTIERT
    const src = 'https://accounts.google.com/gsi/client';

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`
    );
    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // CALLBACK FUNKTION DEFINIEREN
    const handleGoogleLogin = async (response: GoogleCredentialResponse) => {
      console.log('🔹 Google credential received:', response);

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

    // GOOGLE BUTTON RESPONSIVE RENDERN
    const renderGoogleButton = () => {
      const wrap = googleWrapRef.current;
      const btn = googleBtnRef.current;

      if (!wrap || !btn) return;

      const width = Math.round(wrap.getBoundingClientRect().width);
      if (width < 200) return;

      // ERST NACH LADEN INJIZIEREN
      const googleId = window.google?.accounts?.id;
      if (!googleId) return;

      if (!googleInitRef.current) {
        googleId.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleGoogleLogin,
        });
        googleInitRef.current = true;
      }

      // BEI RESIZE NEU RENDERN
      btn.innerHTML = '';

      googleId.renderButton(btn, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
        width,
      });
    };

    // WENN GOOGLE VORHANDEN SOFORT RENDERN, SONST NACH SCRIPT LOAD
    if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      script.onload = () => {
        renderGoogleButton();
      };
    }

    // WENN DIE BREITE SICH ÄNDERT NEU RENDERN
    const ro = new ResizeObserver(() => renderGoogleButton());
    if (googleWrapRef.current) ro.observe(googleWrapRef.current);

    // NICHT WEG MACHEN, DARF GLOBAL BLEIBEN
    return () => {
      ro.disconnect();
    };
  }, [router]);

  // EMAIL REGISTRIERUNG
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // PFLICHTFELD PRÜFUNG
    if (
      !email ||
      !password ||
      (mode === 'register' && (!firstName || !lastName || !confirmPassword))
    ) {
      setError('Please fill in all fields');
      return;
    }

    // STIMMT PASSWORT?
    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(
        mode === 'login' ? '/api/auth/login' : '/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            mode === 'login'
              ? { email, password }
              : { email, password, firstName, lastName }
          ),
        }
      );

      const data = await res.json();

      // WENN FEHLER
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      // TOKEN UND USER IM LOCALSTORAGE SPEICHERN UND WEITERLEITEN
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
        {/* LOGO */}
        <header className="flex flex-col items-center gap-2 mb-4">
          <Logo size={64} />
          <h1 className="text-3xl font-bold text-gray-100">Monera Trading</h1>
          <p className="text-gray-500">Your Paper Trading Simulator</p>
        </header>

        {/* MODE TOGGLE */}
        <nav className="w-full grid grid-cols-2 p-[2px] bg-white/10 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`h-8 rounded-lg text-md ${
              mode === 'login' ? 'bg-black/70' : 'text-white/70'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`h-8 rounded-lg text-md ${
              mode === 'register' ? 'bg-black/70' : 'text-white/70'
            }`}
          >
            Register
          </button>
        </nav>

        {/* AUTH FORM */}
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
              <div className={fieldCls}>
                <label htmlFor="firstName" className={labelCls}>
                  First name
                </label>

                <div className={shellCls}>
                  <span className="grid place-items-center text-white/40">
                    <User size={18} />
                  </span>

                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* NACHNAME */}
              <div className={fieldCls}>
                <label htmlFor="lastName" className={labelCls}>
                  Last name
                </label>

                <div className={shellCls}>
                  <span className="grid place-items-center text-white/40">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className={inputCls}
                  />
                </div>
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
          <div className={fieldCls}>
            <label htmlFor="password" className={labelCls}>
              Password
            </label>

            <div className={shellCls}>
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
                className={inputCls}
                placeholder="Your password"
              />
            </div>
          </div>

          {/* BESTÄTIGTES PASSWORT */}
          {mode === 'register' && (
            <div className={fieldCls}>
              <label htmlFor="confirmPassword" className={labelCls}>
                Confirm Password
              </label>

              <div className={shellCls}>
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
                  className={inputCls}
                />
              </div>
            </div>
          )}

          {/* FEHLERMELDUNG */}
          {error && <p className="text-sm">{error}</p>}

          {/* SUBMIT BUTTON */}
          <div className="mt-2 mb-2">
            <button
              type="submit"
              className="w-full rounded-lg h-9 text-black text-base bg-green-600 "
            >
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

        {/* GOOGLE LOGIN RESPONSIVE GEMACHT*/}
        <div ref={googleWrapRef} className="w-full">
          <div ref={googleBtnRef} className="w-full" />
        </div>

        {/* HINWEIS STARTGUTHABEN */}
        <div className="text-white/30 text-xs">
          <p>Demo account</p>
          <p>with $10,000 starting balance</p>
        </div>
      </section>
    </main>
  );
}
