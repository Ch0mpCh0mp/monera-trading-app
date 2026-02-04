'use client';

import { useMemo, useState } from 'react';
import AppShell from '../layout/AppShell';
import SocialHeader from './SocialHeader';
import SocialTabs, { type SocialTabKey } from './SocialTabs';
import FeaturedConversationCard from './cards/FeaturedConversationCard';
import NewsPostCard from './cards/NewsPostCard';
import FloatingComposeButton from './FloatingComposeButton';

export default function SocialScreen() {
  const [tab, setTab] = useState<SocialTabKey>('feed');

  // Dummy Content (später durch echte Daten ersetzen)
  const featuredCards = useMemo(
    () => [
      {
        sectionTitle: 'Most Popular',
        authorName: 'Briscoe',
        headline: "Poland's economy is on a tear at the moment!",
        excerpt:
          "I've had a few discussions in the past few days about this...",
        stats: { likes: 161, comments: 301, time: '1T' },
        groupName: 'ETFs',
        groupMembers: '95.000 Mitglieder',
        primaryCta: 'Join',
        secondaryCta: 'Follow',
      },
      {
        sectionTitle: 'Most Popular',
        authorName: 'Mira',
        headline: 'Rates cut expectations just shifted',
        excerpt: 'Market pricing moved fast after the latest releases...',
        stats: { likes: 98, comments: 120, time: '6h' },
        groupName: 'Macro',
        groupMembers: '41.000 Mitglieder',
        primaryCta: 'Join',
        secondaryCta: 'Follow',
      },
      {
        sectionTitle: 'Most Popular',
        authorName: 'Briscoe',
        headline: "Poland's economy is on a tear at the moment!",
        excerpt:
          "I've had a few discussions in the past few days about this...",
        stats: { likes: 161, comments: 301, time: '1T' },
        groupName: 'ETFs',
        groupMembers: '95.000 Mitglieder',
        primaryCta: 'Join',
        secondaryCta: 'Follow',
      },
      {
        sectionTitle: 'Most Popular',
        authorName: 'Mira',
        headline: 'Rates cut expectations just shifted',
        excerpt: 'Market pricing moved fast after the latest releases...',
        stats: { likes: 98, comments: 120, time: '6h' },
        groupName: 'Macro',
        groupMembers: '41.000 Mitglieder',
        primaryCta: 'Join',
        secondaryCta: 'Follow',
      },
    ],
    []
  );

  const disclaimer = useMemo(
    () =>
      'Trading 212 offers an execution-only service, not investment advice or portfolio management, and is not responsible for user-generated content. Always do your own research. When investing, your capital is at risk and you may get back less than you invested.',
    []
  );

  const newsPost = useMemo(
    () => ({
      badge: 'USA 30 News',
      verified: true,
      meta: 'Official Top News',
      time: '1S',
      title:
        'Traders Await Labor Market Data as US Equity Futures Waver Pre-Bell',
      body: 'US equity futures were little changed pre-bell Wednesday as traders awaited labor market data...',
    }),
    []
  );

  return (
    <AppShell className='overflow-auto' containerClassName="relative">
      <div className="pt-2">
        <SocialHeader />
      </div>

      <div className="mt-5">
        <SocialTabs value={tab} onChange={setTab} />
      </div>

      <section className="mt-4 pb-8">
        {tab === 'feed' ? (
          <div className="space-y-4">
            <h2 className="text-white font-semibold tracking-wide">
              {featuredCards[0].sectionTitle}
            </h2>

            {featuredCards.map((card, idx) => (
              <FeaturedConversationCard key={idx} {...card} />
            ))}

            <p className="text-white/35 text-xs leading-relaxed">
              {disclaimer}
            </p>

            <div className="h-px bg-white/10" />

            <NewsPostCard {...newsPost} />
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-white font-semibold tracking-wide">
              Communities
            </h2>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/70 text-sm">
                Platzhalter: Hier kommen eure Communities (Listen/Filter/Search)
                rein.
              </p>
            </div>
          </div>
        )}
      </section>

      <FloatingComposeButton />
    </AppShell>
  );
}
