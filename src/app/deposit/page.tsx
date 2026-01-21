'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { usePortfolio } from '../context/PortfolioContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DepositPage() {
  const { balance, setBalance } = usePortfolio();
  const [amount, setAmount] = useState(100); // Startwert
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col gap-4 p-6">
      {/* TopBar wie Dashboard */}
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-semibold">Deposit</h1>
      </div>

      <div className="flex flex-col items-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-sm">
          <label className="text-sm text-white/70">Amount (€)</label>
          <input
            type="number"
            value={amount}
            min={1}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full mt-2 px-4 py-3 rounded-lg bg-black border border-white/20 text-white"
          />

          <div className="mt-6">
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                currency: 'EUR',
                intent: 'capture',
              }}
            >
              <PayPalButtons
                style={{ layout: 'vertical' }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        amount: {
                          value: amount.toString(),
                          currency_code: 'EUR',
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  await actions.order?.capture();

                  // Guthaben erhöhen
                  setBalance(balance + amount);

                  // Zurück zum Dashboard
                  router.push('/dashboard');
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
