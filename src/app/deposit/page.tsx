"use client";

import Link from 'next/link';

export default function DepositPage() {
    return (
        <main className="min-h-screen bg-black px-6 pt-8 pb-24">
            <h1>Deposit</h1>
            <Link href="/dashboard">Back to Dashboard</Link>
        </main>
    );
}