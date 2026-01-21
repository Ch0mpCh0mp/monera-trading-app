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
    <div className="min-h-screen text-white bg-black">
      {/* AUTH PAGE HINTERGRUND */}
      {/* <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.08),transparent_50%)]" />
      </div> */}

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
          {/* CARD WIE IN DER AUTH */}
          <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
            {/* BACK BUTTON */}
            {/* <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="absolute right-6 bottom-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              Back
            </button> */}

            {/* LOGO UND NAME */}
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

              {/* WOLLEN WIR DAS BEHALTEN? */}
              {/* <p className="mt-3 text-sm text-white/70">Deposit</p> */}
            </div>

            {/* FORM */}
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

            {/* PAYPAL */}
            <div className="mt-6">
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                  currency: 'EUR',
                  intent: 'capture',
                }}
              >
                <div className="rounded-xl border border-white/10 bg-white/5 sm:p-3 max-h-[320px] overflow-auto sm:max-h-none sm:overflow-visible">
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
                      setBalance(balance + amount);
                      router.push('/dashboard');
                    }}
                  />
                </div>
              </PayPalScriptProvider>
            </div>

            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full mt-6 rounded-lg h-9 text-black text-base bg-green-600 hover:bg-green-500"
            >
              Back
            </button>

            <p className="mt-6 text-center text-xs text-white/40">
              Payments are processed by PayPal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
