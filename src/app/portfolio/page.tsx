import BottomNav from '../components/BottomNav';
import Logo from '../components/Logo';
import { getWatchlist } from '@/data/tradingClient';
import AssetRow from '../components/AssetRow';

export default async function PortfolioPage() {
    const watchlist = await getWatchlist();
    
    return (
        <main>
            <h1>Portfolio</h1>
            <section>
                {watchlist.map((asset) => (
                    <AssetRow
                    key={asset.id}
                    name={asset.name}
                    symbol={asset.symbol}
                    price={asset.price}
                    changePct={asset.changePct}
                    trend={asset.trend} />
                ))}
            </section>
            <BottomNav />
        </main>
    );
}