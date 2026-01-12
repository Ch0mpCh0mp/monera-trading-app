"use client";

import Link from 'next/link';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className='fixed left-0 right-0 bottom-0 bg-pink-600 p-4'>
        <div className='flex justify-around'>
           <span className={pathname === '/dashboard' ? 'nav-item active' : 'nav-item'}><Link href="/dashboard"><House size={28} /></Link></span>
           <span className={pathname === '/portfolio' ? 'nav-item active' : 'nav-item'}><Link href="/portfolio"><ChartPie size={28} /></Link></span>
           <span className={pathname === '/search' ? 'nav-item active' : 'nav-item'}><Link href="/search"><Search size={28} /></Link></span>
           <span className={pathname === '/profile' ? 'nav-item active' : 'nav-item'}><Link href="/profile"><User size={28} /></Link></span>
           <span className={pathname === '/menu' ? 'nav-item active' : 'nav-item'}><Link href="/menu"><Menu size={28} /></Link></span>
        </div>
      </nav>
    );
}