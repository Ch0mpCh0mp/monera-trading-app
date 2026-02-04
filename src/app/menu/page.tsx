'use client';

import AppShell from '../components/layout/AppShell';
import {
  UserCircle2,
  RefreshCw,
  BadgePercent,
  Wallet,
  PlaySquare,
  GraduationCap,
  CalendarDays,
  Bell,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';

type MenuRowProps = {
  icon: React.ElementType;
  label: string;
  trailing?: 'chevron' | 'external';
  onClick?: () => void;
};

function MenuRow({
  icon: Icon,
  label,
  trailing = 'chevron',
  onClick,
}: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-4 text-left rounded-xl px-2 active:bg-white/5 hover:bg-white/5 transition"
    >
      <span className="shrink-0 w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center">
        <Icon size={24} strokeWidth={1.5}  className="opacity-90" />
      </span>

      <span className="flex-1 text-md text-white/85">{label}</span>

      {trailing === 'external' ? (
        <ExternalLink size={18} className="opacity-70" />
      ) : (
        <ChevronRight size={20} className="opacity-60" />
      )}
    </button>
  );
}

type PillProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function Pill({ label, active, onClick }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full rounded-2xl px-3 py-3.5',
        'flex flex-col items-center justify-center gap-1.5',
        'border bg-white/5',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.03)]',
        active
          ? 'border-green-500/70 bg-green-500/12 text-white'
          : 'border-white/12 text-white/85 hover:bg-white/7',
        'active:scale-[0.99] transition',
      ].join(' ')}
    >
      <span className="flex items-center justify-center">
        <Logo size={24} />
      </span>

      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function MenuPage() {
  const router = useRouter();

  return (
    <AppShell>
      {/* Top row (account + refresh) */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <UserCircle2
            size={30}
            strokeWidth={1.25}
            className="text-white/90"
          />
          <div className="leading-tight">
            <p className="text-lg text-white/85">demo@user.com</p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Refresh"
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center"
        >
          <RefreshCw size={18} className="text-white/80" />
        </button>
      </header>

      {/* Pills */}
      <section className="mt-5 grid grid-cols-3 gap-3">
        <Pill label="Invest" />
        <Pill label="CFD" active />
        <Pill label="Crypto" />
      </section>

      {/* Menu list */}
      <section className="mt-6 divide-y divide-white/10">
        <MenuRow icon={BadgePercent} label="Interest on cash" />
        <MenuRow icon={Wallet} label="Manage funds" />
        <MenuRow icon={PlaySquare} label="Videos" />
        <MenuRow icon={GraduationCap} label="Learn" trailing="external" />
        <MenuRow icon={CalendarDays} label="Economic calendar" />
        <MenuRow icon={Bell} label="Price alerts" />
        <MenuRow icon={Clock} label="History" />
      </section>

      {/* Primary CTA */}
      <div className="mt-8 pb-2">
        <button
          type="button"
          onClick={() => router.push('/deposit')}
          className={[
            'w-full h-12 rounded-full font-medium text-xl',
            'bg-green-500 text-black',
            'active:scale-[0.99] transition',
          ].join(' ')}
        >
          Deposit
        </button>
      </div>
    </AppShell>
  );
}
