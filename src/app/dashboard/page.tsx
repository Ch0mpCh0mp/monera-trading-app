'use client';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 pt-8 pb-24">
        <section className="mb-8">
            <p className="text-xs uppercase tracking-wider text-white/50">Account Value</p>
            <p className="text-4xl font-semibold text-white">€10.000,00</p>
            <p className="text-sm text-white/70">+0.00 (0.00%) Today</p>
        </section>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
        <p className="text-xs uppercase tracking-wider text-white/50">Margin</p>
        <p className="text-2xl font-semibold text-white">€0,00</p>
        </div>
    </main>
  );
}
