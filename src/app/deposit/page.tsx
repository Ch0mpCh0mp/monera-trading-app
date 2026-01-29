'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { usePortfolio } from '../context/PortfolioContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// HAB ICH HINZUGEFÜGT
import Logo from '../components/Logo';
import { CreditCard } from 'lucide-react';

export default function DepositPage() {
  const { balance, setBalance } = usePortfolio();
  const [amount, setAmount] = useState(100); // Startwert
  const router = useRouter();

  // HAB ICH HINZUGEFÜGT
  const labelCls = 'text-sm font-medium text-white/80 block';
  const shellCls =
    'w-full grid grid-cols-[44px_1fr] items-center h-11 rounded-xl bg-black/30 border border-white/10 focus-within:ring-4 focus-within:ring-white/10';
  const iconWrapCls = 'h-full w-full grid place-items-center text-white/60';
  const inputCls =
    'h-full w-full bg-transparent outline-none text-sm text-white/90 placeholder:text-white/40 pr-3';

  return (
    <div className="min-h-dvh text-white bg-black px-4 sm:px-6 py-10 flex justify-center items-start sm:items-center overflow-y-auto">
      {/* CARD HINTERGRUND */}
      <div className="w-full max-w-md relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
        {/* HEADER BEREICH */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="mb-4">
            <Logo />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Monera Trading
          </h1>
          <p className="mt-1 text-sm text-white/45">
            Your Paper Trading Simulator
          </p>
        </div>

        {/* FORM BEREICH */}
        <div className="mt-6 space-y-2">
          <label className={labelCls} htmlFor="amount">
            Amount (€)
          </label>

          <div className={shellCls}>
            <div className={iconWrapCls}>
              <CreditCard size={18} />
            </div>

            <input
              id="amount"
              type="number"
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={inputCls}
              placeholder="100"
            />
          </div>

          <p className="text-xs text-white/45">
            Your current balance:{' '}
            <span className="text-white/40">€{balance}</span>
          </p>
        </div>

        <div className="mt-6">
          <PayPalScriptProvider
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
              currency: 'EUR',
              intent: 'capture',
            }}
          >
            {/* White PayPal container */}
            <div className="rounded-3xl bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
              {/* REAL space, no scaling */}
              <div className="px-2 pt-2 pb-8">
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    shape: 'pill',
                    height: 36, // kleiner → weniger Platzverbrauch
                  }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      intent: 'CAPTURE',
                      purchase_units: [
                        {
                          amount: {
                            value: amount.toString(),
                            currency_code: 'EUR',
                          },
                        },
                      ],
                    })
                  }
                  onApprove={async (data, actions) => {
                    await actions.order?.capture();
                    setBalance(balance + amount);
                    router.push('/dashboard');
                  }}
                />
              </div>
            </div>
          </PayPalScriptProvider>
        </div>

        {/* BACK BUTTON  */}
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="w-full mt-6 rounded-lg h-9 text-black text-base bg-green-600 hover:bg-green-500"
        >
          Back
        </button>

        {/* <p className="mt-6 text-center text-xs text-white/40">
          Payments are processed by PayPal
        </p> */}
      </div>
    </div>
  );
}
