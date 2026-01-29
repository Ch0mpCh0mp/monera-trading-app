'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (name: string) => void;
};

export default function CreateWatchlistSheet({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Fokus + ESC schließen
  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => inputRef.current?.focus(), 80);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  // Wenn geschlossen: reset
  useEffect(() => {
    if (!open) setName('');
  }, [open]);

  if (!open) return null;

  const trimmed = name.trim();
  const canCreate = trimmed.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate?.(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop (dim + blur) */}
      <button
        type="button"
        aria-label="Close create watchlist"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
      />

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-[28px] bg-[#0b0f14]/95 border border-white/10 shadow-2xl px-6 pt-3 pb-6">
        {/* Handle */}
        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" />

        <h2 className="text-center text-white/90 text-lg font-medium mb-6">
          Create Watchlist
        </h2>

        <label className="block text-[11px] tracking-widest text-white/40 mb-2">
          NAME
        </label>

        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=""
          className="w-full bg-transparent text-white/90 outline-none pb-2 border-b-2 border-cyan-500/70 focus:border-cyan-400"
        />

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="
            mt-6 w-full rounded-full py-4 text-base font-medium
            bg-cyan-700/80 hover:bg-cyan-700
            disabled:opacity-40 disabled:hover:bg-cyan-700/80
            text-white/90
          "
        >
          Create
        </button>
      </div>
    </div>
  );
}
