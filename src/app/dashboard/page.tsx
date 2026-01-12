'use client';

import StatusCard from "../components/StatusCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black px-6 pt-8 pb-24">
      <section className="mb-8">
        <p className="text-xs uppercase tracking-wider text-white/50">
          Account Value
        </p>
        <p className="text-4xl font-semibold text-white">€10.000,00</p>
        <p className="text-sm text-white/70">+0.00 (0.00%) Today</p>
      </section>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatusCard label="Margin" value="€0,00" />
         <StatusCard label="Level" value="100%" />
      </div>
    </main>
  );
}
