"use client";

import { useMemo, useState } from "react";
import AppShell from "../layout/AppShell";
import SocialHeader from "./SocialHeader";
import SocialTabs, { type SocialTabKey } from "./SocialTabs";
import FeaturedConversationCard from "./cards/FeaturedConversationCard";
import NewsPostCard from "./cards/NewsPostCard";
import FloatingComposeButton from "./FloatingComposeButton";

export default function SocialScreen() {
  const [tab, setTab] = useState<SocialTabKey>("feed");

  // Dummy Content (später durch echte Daten ersetzen)
  const featured = useMemo(
    () => ({
      sectionTitle: "🔥 Beliebteste Unterhaltungen",
      authorName: "Briscoe",
      headline: "Poland's economy is on a tear at the moment!",
      excerpt:
        "I've had a few discussions in the past few days about this...",
      stats: { likes: 161, comments: 301, time: "1T" },
      groupName: "ETFs",
      groupMembers: "95.000 Mitglieder",
      primaryCta: "Beitreten",
      secondaryCta: "Folgen",
    }),
    []
  );

  const disclaimer = useMemo(
    () =>
      "Trading 212 bietet einen reinen Ausführungsdienst an, keine Anlageberatung oder Portfolioverwaltung, und ist nicht verantwortlich für nutzergenerierte Inhalte. Recherchiere immer selbst. Beim Investieren ist dein Kapital gefährdet und du erhältst möglicherweise weniger zurück als du investiert hast.",
    []
  );

  const newsPost = useMemo(
    () => ({
      badge: "USA 30 News",
      verified: true,
      meta: "Official Top News",
      time: "1S",
      title: "Traders Await Labor Market Data as US Equity Futures Waver Pre-Bell",
      body:
        "US equity futures were little changed pre-bell Wednesday as traders awaited labor market data...",
    }),
    []
  );

  return (
    <AppShell containerClassName="relative">
      <div className="pt-2">
        <SocialHeader />
      </div>

      <div className="mt-4">
        <SocialTabs value={tab} onChange={setTab} />
      </div>

      <section className="mt-4 pb-8">
        {tab === "feed" ? (
          <div className="space-y-4">
            <h2 className="text-white font-semibold tracking-wide">
              {featured.sectionTitle}
            </h2>

            <FeaturedConversationCard {...featured} />

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
