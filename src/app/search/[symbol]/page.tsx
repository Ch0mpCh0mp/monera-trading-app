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
      <SymbolHeader symbol={symbol} />
    </AppShell>
  );
}