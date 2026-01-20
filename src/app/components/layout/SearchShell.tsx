'use client';

import type { ReactNode } from 'react';
import BottomNav from '../BottomNav';

type SearchShellProps = {
  children: ReactNode;
};

export default function SearchShell({ children }: SearchShellProps) {
  return (
    <main className="flex flex-col h-screen bg-black pb-24">
      <section className="mt-4 overflow-auto flex-grow">{children}</section>
      <footer>
        <BottomNav />
      </footer>
    </main>
  );
}
