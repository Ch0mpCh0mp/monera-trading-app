import type { ReactNode } from "react";

type StatusCardProps = {
  label: string;
  value: string | number;
  // IST DER BUTTON
  rightSide?: ReactNode;
};

export default function StatusCard({ label, value, rightSide, }: StatusCardProps) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-white/50">
          {label}
        </p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      {rightSide ? <div className="shrink-0">{rightSide}</div> : null}
    </div>
  );
}
