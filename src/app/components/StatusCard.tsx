import type { ReactNode } from 'react';

type StatusCardProps = {
  label: string;
  value: string | number;
  // IST DER BUTTON
  rightSide?: ReactNode;
};

export default function StatusCard({
  label,
  value,
  rightSide,
}: StatusCardProps) {
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-2 flex items-center justify-between gap-3">

      {/* MARGIN LEVEL UND CASH BEREICH */}
      <div className="min-w-0">
        {/* LABEL */}
        <p className="text-sm uppercase tracking-wider text-white/50">{label}</p>
        {/* WERT */}
        <p className="text-lg font-medium text-white">{value}</p>
      </div>
      {/* DEPOSIT BUTTON */}
      {rightSide ? <div className="shrink-0">{rightSide}</div> : null}
    </section>
  );
}
