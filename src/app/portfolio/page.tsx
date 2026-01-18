import { getWatchlist, getAccountSummary } from '@/data/tradingClient';
import AssetRow from '../components/AssetRow';
import TopBar from '../components/Topbar';
import AppShell from '../components/layout/AppShell';

export default async function PortfolioPage() {
  const watchlist = await getWatchlist();
  const account = await getAccountSummary();

  return (
    
      <AppShell containerClassName="mt-4 space-y-6">
        <TopBar />
        <section>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-lg">Wert</p>
              <p className="text-white text-4xl font-light mt-1">
                {account.accountValue.value.toFixed(2)} €
              </p>
            </div>

            <button
              aria-label="Add"
              className="mt-2 w-12 h-12 rounded-full bg-green-600 hover:bg-green-400 flex items-center justify-center text-white"
            >
              +
            </button>
          </div>

          <button className="mt-5 w-full rounded-full bg-green-600 hover:bg-green-500 text-white py-3 flex items-center justify-center gap-2 text-sm">
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
      </AppShell>
      
  );
}
