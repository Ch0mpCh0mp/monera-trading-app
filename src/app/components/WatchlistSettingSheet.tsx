'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Trash2 } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  watchlistName: string;
  onRename: (nextName: string) => void;
  onDelete: () => void;
};

export default function WatchlistSettingsSheet({
  open,
  onClose,
  watchlistName,
  onRename,
  onDelete,
}: Props) {
  const [name, setName] = useState<string>(watchlistName);
  const inputRef = useRef<HTMLInputElement | null>(null);

  
useEffect(() => {
  if (!open) return;

  const t = setTimeout(() => setName(watchlistName), 0);
  setTimeout(() => inputRef.current?.focus(), 50);

  return () => clearTimeout(t);
}, [open, watchlistName]);

  const trimmed = name.trim();
  const canRename = trimmed.length > 0 && trimmed !== watchlistName;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[#0f1a14] border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-base font-semibold">
            Watchlist settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-white/15 text-white/80"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-white/60 text-xs">Name</label>
          <input
            ref={inputRef}
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white/90 outline-none"
            enterKeyHint="done"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canRename) onRename(trimmed);
            }}
          />

          <button
            type="button"
            disabled={!canRename}
            onClick={() => onRename(trimmed)}
            className={`mt-3 w-full py-3 rounded-xl ${
              canRename
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            Rename
          </button>
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onDelete}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-200"
          >
            <Trash2 size={16} />
            Delete watchlist
          </button>
        </div>

        <p className="mt-3 text-white/30 text-xs">
          (Frontend-only) Rename/Delete are local. Backend can replace this
          later.
        </p>
      </div>
    </div>
  );
}
