'use client';

import Link from 'next/link';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: '/dashboard', icon: House, label: 'Dashboard' },
    { href: '/portfolio', icon: ChartPie, label: 'Portfolio' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/social', icon: User, label: 'Social' },
    { href: '/menu', icon: Menu, label: 'Menu' },
  ];

  return (
    <nav aria-label='Bottom navigation' className="fixed left-0 right-0 bottom-0 border-t-2 border-green-500/40 p-4">
      {/* NAVIGATIONS BAR */}
      <ul className="flex justify-around">
        {items.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-label={label}
              className={pathname === href ? 'nav-item active' : 'nav-item'}
            >
              <Icon size={28} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
