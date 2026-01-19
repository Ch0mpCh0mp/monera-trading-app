"use client";

import { useMemo } from "react";

export type AccountSummary = {
    accountValue: number;
    currency: 'EUR' | 'USD';
    levelPct: number;
    changeSumToday?: number;
    changePct?: number;
}

export function useAccountSummary(): AccountSummary {
    const data = useMemo<AccountSummary>(() => ({
        accountValue: 12543.21,
        currency: 'EUR',
        levelPct: 100,
        changeSumToday: 123.45,
        changePct: 0.99
    }),
[]);

return data;
}