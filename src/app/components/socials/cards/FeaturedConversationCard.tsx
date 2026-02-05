type Props = {
  authorName: string;
  headline: string;
  excerpt: string;
  stats: { likes: number; comments: number; time: string };
  groupName: string;
  groupMembers: string;
  primaryCta: string;
  secondaryCta: string;
};

const GREEN = "rgba(0, 166, 62, 1)";

export default function FeaturedConversationCard({
  authorName,
  headline,
  excerpt,
  stats,
  groupName,
  groupMembers,
  primaryCta,
  secondaryCta,
}: Props) {
  return (
    <article className="h-[280px] flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10" />
          <p className="text-white font-medium leading-tight truncate">{authorName}</p>
        </div>

        <button
          className="rounded-full px-4 py-2 text-sm font-medium text-white/90 border border-white/15 bg-white/5 hover:bg-white/10 transition"
          type="button"
        >
          {secondaryCta}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_96px] gap-3">
        <div className="min-w-0">
          <h3 className="text-white font-semibold leading-snug">{headline}</h3>
          <p className="mt-1 text-white/60 text-sm leading-relaxed line-clamp-2">{excerpt}</p>

          <div className="mt-3 flex items-center gap-4 text-white/50 text-xs">
            <span>♥ {stats.likes}</span>
            <span>💬 {stats.comments}</span>
            <span>{stats.time}</span>
          </div>
        </div>

        <div className="h-20 w-24 rounded-xl bg-white/10" />
      </div>

      <div className="mt-4 h-px bg-white/10" />

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/10" />
          <div className="leading-tight">
            <p className="text-white font-medium">{groupName}</p>
            <p className="text-white/50 text-xs">{groupMembers}</p>
          </div>
        </div>

        <button
          className="rounded-full px-4 py-2 text-sm font-semibold text-black"
          style={{ backgroundColor: GREEN }}
          type="button"
        >
          {primaryCta}
        </button>
      </div>
    </article>
  );
}
