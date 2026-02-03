import { Bell, UserCircle2 } from "lucide-react";

export default function SocialHeader() {
  return (
    <header className="flex items-center justify-between">
      <button aria-label="Profile" className="text-white/80 hover:text-white transition">
        <UserCircle2 size={26} />
      </button>

      <h1 className="text-white font-semibold tracking-wide">Social</h1>

      <button aria-label="Notifications" className="text-white/80 hover:text-white transition">
        <Bell size={22} />
      </button>
    </header>
  );
}
