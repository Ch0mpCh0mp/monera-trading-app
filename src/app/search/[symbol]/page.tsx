import AppShell from "@/app/components/layout/AppShell";
import SymbolHeader from "./SymbolHeader";

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
    </AppShell>
  );
}