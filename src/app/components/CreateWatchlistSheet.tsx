'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (name: string) => void;
};

export default function CreateWatchlistSheet({
  open,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    setName('');
    onClose();
  }, [onClose]);

  // Fokus + ESC schließen
  useEffect(() => {
    if (!open) return;

    const t = window.setTimeout(() => inputRef.current?.focus(), 80);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, handleClose]);

  if (!open) return null;

  const trimmed = name.trim();
  const canCreate = trimmed.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate?.(trimmed);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close create watchlist"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
      />

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-[28px] bg-[#0a0a0a]/95 border border-white/10 shadow-2xl px-6 pt-3 pb-6">
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
          className="
            w-full bg-transparent text-white/90 outline-none pb-2
            border-b-2 border-[rgba(0,166,62,0.55)]
            focus:border-[rgba(0,166,62,1)]
          "
        />

        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate}
          className="
            mt-6 w-full rounded-full py-4 text-base font-medium
            bg-[rgba(0,166,62,0.85)] hover:bg-[rgba(0,166,62,1)]
            disabled:opacity-40 disabled:hover:bg-[rgba(0,166,62,0.85)]
            text-white
          "
        >
          Create
        </button>
      </div>
    </div>
  );
}
