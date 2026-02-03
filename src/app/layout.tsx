import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { PortfolioProvider } from './context/PortfolioContext';
import { MarketsProvider } from './context/MarketsContext';

// Fonts
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Monera Trading',
  description: 'Paper Trading Simulator',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* 🔹 MarketsProvider außen, PortfolioProvider innen */}
          <MarketsProvider>
            <PortfolioProvider>
              {children}
            </PortfolioProvider>
          </MarketsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
