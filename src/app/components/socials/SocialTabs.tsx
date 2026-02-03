"use client";

export type SocialTabKey = "feed" | "communities";

type Props = {
  value: SocialTabKey;
  onChange: (v: SocialTabKey) => void;
};

const GREEN = "rgba(0, 166, 62, 1)";
const INACTIVE = "rgba(255,255,255,0.55)";

export default function SocialTabs({ value, onChange }: Props) {
  return (
    <div className="relative">
      <div className="flex items-end gap-8 border-b border-white/10">
        <button
          type="button"
          onClick={() => onChange("feed")}
          className="pb-3 text-sm font-medium"
          style={{ color: value === "feed" ? "white" : INACTIVE }}
        >
          Feed
        </button>

        <button
          type="button"
          onClick={() => onChange("communities")}
          className="pb-3 text-sm font-medium"
          style={{ color: value === "communities" ? "white" : INACTIVE }}
        >
          Communities
        </button>
      </div>

      <div className="relative h-[2px]">
        <div
          className="absolute top-0 h-[2px] w-16 rounded-full transition-all duration-300"
          style={{
            backgroundColor: GREEN,
            left: value === "feed" ? "0px" : "96px",
          }}
        />
      </div>
    </div>
  );
}
