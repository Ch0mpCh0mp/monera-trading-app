import Logo from '../components/Logo';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="flex flex-col items-center gap-2 text-center w-full max-w-sm p-6 border rounded-xl shadow-md">
        <header>
          <Logo size={64} aria-label="Monera Trading Logo" />
          <h1>MONERA TRADING</h1>
          <p>Your Paper Trading Simulator</p>
        </header>

        <nav aria-label="Authentication mode">
          <button>Login</button>
          <button>Register</button>
        </nav>

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>

        <p>Demo account with $10,000 starting balance</p>
      </section>
    </main>
  );
}
