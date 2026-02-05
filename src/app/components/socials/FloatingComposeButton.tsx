import { Pencil } from 'lucide-react';

const GREEN = 'rgba(0, 166, 62, 1)';

export default function FloatingComposeButton() {
  return (
    <button
      type="button"
      aria-label="Create post"
      className="
    fixed
    right-4
    bottom-[96px]
    h-12 w-12
    rounded-full
    shadow-lg
    flex items-center justify-center
    bg-green-500
    active:scale-95 transition
  "
      style={{ backgroundColor: GREEN }}
    >
      <Pencil size={22} className="text-black" />
    </button>
  );
}
