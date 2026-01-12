'use client';

import StatusCard from '../components/StatusCard';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 pt-8 pb-24">
      <section className="mb-8">
        <p className="text-xs uppercase tracking-wider text-white/50">
          Account Value
        </p>
        <p className="text-4xl font-semibold text-white">10.000,00 €</p>
        <p className="text-sm text-white/70 underline">+0.00 € (0.00%) Today</p>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatusCard label="Margin" value="0,00 €" />
        <StatusCard label="Level" value="100%" />
      </div>

      <div className="flex justify-between rounded-2xl bg-white/5 border border-white/10 p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/50">CASH</p>
          <p className="text-2xl font-semibold text-white">0,00 €</p>
        </div>

        <button className="mt-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full">
          Deposit
        </button>
      </div>
    </main>
  );
}
