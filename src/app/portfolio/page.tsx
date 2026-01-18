import BottomNav from '../components/BottomNav';
import { getWatchlist, getAccountSummary } from '@/data/tradingClient';
import AssetRow from '../components/AssetRow';
import TopBar from '../components/Topbar';

export default async function PortfolioPage() {
  const watchlist = await getWatchlist();
  const account = await getAccountSummary();

  return (
    <main className="min-h-screen bg-black pt-6 pb-24">
      <TopBar />
      <section className="px-4 mt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-lg">Wert</p>
            <p className="text-white text-4xl font-light mt-1">
              {account.accountValue.value.toFixed(2)} €
            </p>
          </div>

          <button
            aria-label="Add"
            className="mt-2 w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-white"
          >
            +
          </button>
        </div>

        <button className="mt-5 w-full rounded-full bg-sky-500/90 hover:bg-sky-500 text-white py-3 flex items-center justify-center gap-2 text-sm">
          Margin-Level · {account.levelPct} %
          <span className="text-white/90">▾</span>
        </button>
      </section>

      <section>
        {watchlist.map((asset) => (
          <AssetRow
            key={asset.id}
            name={asset.name}
            symbol={asset.symbol}
            price={asset.price}
            changePct={asset.changePct}
            trend={asset.trend}
          />
        ))}
      </section>
      <BottomNav />
    </main>
  );
}
