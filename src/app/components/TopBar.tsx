import Logo from './Logo';
import { Bell, ChevronDown } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo size={30} />
        <button aria-haspopup='menu' aria-expanded={false} className="flex items-center gap-1 text-white text-xl font-semibold tracking-wide">
          CFD <ChevronDown size={18} className="text-white" />
        </button>
      </div>

      <button
        className="text-white/80 hover:text-white"
        aria-label="Notifications"
      >
        <Bell size={24} />
      </button>
    </header>
  );
}
