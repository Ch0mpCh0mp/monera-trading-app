type Props = {
  badge: string;
  verified: boolean;
  meta: string;
  time: string;
  title: string;
  body: string;
};

export default function NewsPostCard({ badge, verified, meta, time, title, body }: Props) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-full bg-white/10" />
            <p className="text-white font-medium truncate">
              {badge} {verified ? <span className="text-sky-400">✓</span> : null}
            </p>
          </div>
          <p className="mt-1 text-white/50 text-xs">{meta}</p>
        </div>

        <span className="text-white/40 text-xs">{time}</span>
      </div>

      <h3 className="mt-3 text-white font-semibold leading-snug">{title}</h3>
      <p className="mt-2 text-white/60 text-sm leading-relaxed">{body}</p>
    </article>
  );
}
