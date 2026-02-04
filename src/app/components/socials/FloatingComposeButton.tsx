import { Pencil } from "lucide-react";

const GREEN = "rgba(0, 166, 62, 1)";

export default function FloatingComposeButton() {
  return (
    <button
      type="button"
      aria-label="Create post"
      className="absolute right-4 bottom-28 h-14 w-14 rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition"
      style={{ backgroundColor: GREEN }}
    >
      <Pencil size={22} className="text-black" />
    </button>
  );
}
