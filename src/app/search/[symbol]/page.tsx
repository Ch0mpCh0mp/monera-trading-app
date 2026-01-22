import AppShell from "@/app/components/layout/AppShell";
import SymbolHeader from "./SymbolHeader";
import BuySellCard from "./BuySellCard";
import { Gem } from "lucide-react";

export default async function SymbolPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;

  return (
    <AppShell>
      <SymbolHeader />
      <h1 className="text-white/90 text-2xl font-semibold text-center mt-2">{symbol}</h1>
      <BuySellCard sellPrice="4.442,64 €" buyPrice="4.443,65 €" assetIcon={<Gem className="w-6 h-6 text-yellow-400" />} />
    </AppShell>
  );
}