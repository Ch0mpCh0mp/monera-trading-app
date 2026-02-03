'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type SocialTabKey = 'feed' | 'communities';

type Props = {
  value: SocialTabKey;
  onChange: (v: SocialTabKey) => void;
};

const GREEN = 'rgba(0, 166, 62, 1)';

const UNDERLINE_EXTRA_PX = 40; 
const UNDERLINE_HEIGHT_PX = 3;

export default function SocialTabs({ value, onChange }: Props) {
  const feedRef = useRef<HTMLButtonElement | null>(null);
  const commRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const activeRef = useMemo(() => (value === 'feed' ? feedRef : commRef), [value]);

  useEffect(() => {
    const update = () => {
      const btn = activeRef.current;
      const wrap = containerRef.current;
      if (!btn || !wrap) return;

      const btnRect = btn.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();

      const width = btnRect.width + UNDERLINE_EXTRA_PX;
      const left = btnRect.left - wrapRect.left - UNDERLINE_EXTRA_PX / 2;

      setUnderline({ left, width });
    };

    update();

    // optional: falls Fonts später laden, nochmal nachziehen
    const t = window.setTimeout(update, 50);

    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', update);
    };
  }, [activeRef]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative flex justify-center gap-24 border-b border-white/10"
      >
        <button
          ref={feedRef}
          type="button"
          onClick={() => onChange('feed')}
          className={[
            'pb-2.5 text-lg font-medium leading-6 tracking-wide transition',
            value === 'feed' ? 'text-white' : 'text-white/60 hover:text-white/80',
          ].join(' ')}
        >
          Feed
        </button>

        <button
          ref={commRef}
          type="button"
          onClick={() => onChange('communities')}
          className={[
            'pb-2.5 text-lg font-medium leading-6 tracking-wide transition',
            value === 'communities' ? 'text-white' : 'text-white/60 hover:text-white/80',
          ].join(' ')}
        >
          Communities
        </button>

        <span
          aria-hidden="true"
          className="absolute bottom-0 rounded-full transition-[left,width] duration-300"
          style={{
            backgroundColor: GREEN,
            left: underline.left,
            width: underline.width,
            height: `${UNDERLINE_HEIGHT_PX}px`,
          }}
        />
      </div>
    </div>
  );
}
