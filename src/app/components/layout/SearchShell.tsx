'use client';

import type { ReactNode } from 'react';
import Container from './Container';
import BottomNav from '../BottomNav';

type SearchShellProps = {
  children: ReactNode;
};

export default function SearchShell({ children }: SearchShellProps) {
  return (
    <main className="flex flex-col h-screen bg-black pt-6 pb-24">
      <Container className="flex-grow">
        <section className="pt-4 overflow-auto h-full pb-6">
          {children}
        </section>
      </Container>
      <BottomNav />
    </main>
  );
}
