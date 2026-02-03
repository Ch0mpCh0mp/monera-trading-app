import { Bell, UserCircle2 } from "lucide-react";

export default function SocialHeader() {
  return (
    <header className="grid grid-cols-3 items-center">
      <button
        aria-label="Profile"
        className="justify-self-start text-white/80 hover:text-white transition"
      >
        <UserCircle2 size={30} />
      </button>

      <h1 className="justify-self-center text-white font-md tracking-wide text-xl">
        Social
      </h1>

      <button
        aria-label="Notifications"
        className="justify-self-end text-white/80 hover:text-white transition"
      >
        <Bell size={26} />
      </button>
    </header>
  );
}
