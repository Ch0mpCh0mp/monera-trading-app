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
    <div
      className="
        rounded-2xl
        bg-white/5
        border border-white/5
        px-4 py-3
        flex items-center justify-between
        gap-3
      "
    >
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-white/50 leading-none">
          {label}
        </p>
        <p className="text-xl font-medium text-white leading-tight mt-1">
          {value}
        </p>
      </div>

      {rightSide ? <div className="shrink-0">{rightSide}</div> : null}
    </div>
  );
}
