'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';

type Instrument = {
  name: string;
  symbol: string;
  price: number;
  changePct: number;
  trend: 'up' | 'down' | 'neutral';
  image?: string;
  sparklineData?: number[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  instruments: Instrument[];
  onAdd: (instrument: Instrument) => void;
  title?: string;
};

export default function AddInstrumentSheet({
  open,
  onClose,
  instruments,
  onAdd,
  title = 'Add instruments',
}: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(id);
    // Fokus fürs Mobile-Keyboard (auf echten Geräten)
    // setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return instruments;
    return instruments.filter((i) => {
      return (
        i.name.toLowerCase().includes(q) || i.symbol.toLowerCase().includes(q)
      );
    });
  }, [query, instruments]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#0f1a14] border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 text-white/80"
          >
            <X size={18} />
          </button>
        </div>

        {/* search */}
        <div className="mt-3 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
          <Search size={16} className="text-white/40" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or symbol…"
            className="w-full bg-transparent text-white/90 outline-none placeholder:text-white/30"
            enterKeyHint="search"
          />
        </div>

        {/* list */}
        <div className="mt-3 max-h-[55vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="text-white/50 text-sm py-6 text-center">
              No instruments found.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.slice(0, 50).map((i) => (
                <button
                  key={i.symbol}
                  type="button"
                  onClick={() => onAdd(i)}
                  className="w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-3 py-3 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {i.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={i.image}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10" />
                    )}

                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {i.name}
                      </p>
                      <p className="text-white/50 text-xs">{i.symbol}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-white text-sm font-medium">
                      {Number.isFinite(i.price) ? i.price.toFixed(2) : '—'}
                    </p>
                    <p className="text-xs text-white/50">
                      {Number.isFinite(i.changePct)
                        ? `${i.changePct.toFixed(2)}%`
                        : '—'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="mt-3 text-white/30 text-xs">
          (Frontend-only) Selection is added locally. Backend can replace this
          later.
        </p>
      </div>
    </div>
  );
}
