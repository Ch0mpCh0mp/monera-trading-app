'use client';

import { useState } from 'react';

type TradeModalProps = {
  type: 'buy' | 'sell';
  price: number;
  onClose: () => void;
  onConfirm: (amount: number, leverage: number) => void;
};

export default function TradeModal({
  type,
  price,
  onClose,
  onConfirm,
}: TradeModalProps) {
const [amount, setAmount] = useState<number>(1);      // <-- NEU
  const [leverage, setLeverage] = useState<number>(1);  // <-- NEU

  // Berechnungen für Invested und Effective
  const invested = amount * price;
  const effective = invested * leverage;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
       <div className="relative w-full max-w-md bg-[#0b1220] rounded-t-2xl p-4">
<button
  onClick={onClose}
  className="absolute top-2 right-2 text-white/70 hover:text-white text-lg font-bold"
>
  ×
</button>

        <h2 className="text-white text-lg font-semibold mb-3">
          {type === 'buy' ? 'Buy' : 'Sell'} Order
        </h2>

        {/* Close Button oben rechts */}


{/* Betrag */}
<div className="text-white/70 text-sm mb-1">Amount (Einheiten Gold, z.B. 10)</div>
<input
  type="number"
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(Number(e.target.value))}
  className="w-full mb-3 px-3 py-2 rounded-md text-sm"
/>

{/* Leverage */}
<div className="text-white/70 text-sm mb-1">Leverage (Hebel, z.B. 2x)</div>
<input
  type="number"
  placeholder="Leverage"
  value={leverage}
  min={1}
  step={1}
  onChange={(e) => setLeverage(Number(e.target.value))}
  className="w-full mb-3 px-3 py-2 rounded-md text-sm"
/>

<div className="text-white/70 text-sm mb-4">
  Dein Einsatz: {invested.toFixed(2)} € | Kontrollierter Wert (inkl. Hebel): {effective.toFixed(2)} €
</div>

        {/* Preis */}
        <div className="text-white/70 text-sm mb-4">
          Price: {price.toFixed(2)}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-md bg-white/10 text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(amount, leverage)}
            className="flex-1 py-2 rounded-md bg-blue-600 text-white font-medium"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
