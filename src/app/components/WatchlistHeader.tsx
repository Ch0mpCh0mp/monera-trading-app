'use client';

import { Plus, Pencil } from 'lucide-react';

type WatchlistHeaderProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  onAddClick?: () => void;
  onEditClick?: () => void;
};

export default function WatchlistHeader<T extends string>({ tabs, activeTab, onTabChange, onAddClick, onEditClick, }: WatchlistHeaderProps<T>) {
    const iconBtnBase =
    "grid place-items-center h-8 w-8 rounded-lg bg-white/10 text-white/70 " +
    "active:scale-[0.98] transition " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/30";

  return (
    <header className="flex items-center justify-between gap-3">
      {/* ÜBERSICHTSSEITEN HEADER */}

      {/* TABS LINKS */}
      <div className="flex flex-1 items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-sm text-center transition ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* BUTTONS RECHTS */}
      <div className="flex items-center gap-2 shrink-0">
        {/* PLUS BUTTON */}
        <button
          type="button"
          aria-label="Watchlist hinzufügen"
          onClick={onAddClick ?? undefined}
          disabled={!onAddClick}
          className={`${iconBtnBase} ${onAddClick ? 'hover:bg-white/15 hover:text-white' : 'opacity-40 cursor-not-allowed'}`}
        >
          <Plus size={18} />
        </button>

        {/* STIFT BUTTON */}
        <button
          type="button"
          aria-label="Watchlists bearbeiten"
          onClick={onEditClick ?? undefined}
          disabled={!onEditClick}
          className={`${iconBtnBase} ${onEditClick ? 'hover:bg-white/15 hover:text-white' : 'opacity-40 cursor-not-allowed'}`}
        >
          <Pencil size={18} />
        </button>
      </div>
    </header>
  );
}
