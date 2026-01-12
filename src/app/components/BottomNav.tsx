"use client";

import Link from 'next/link';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';

export default function BottomNav() {
    return (
        <nav className='fixed left-0 right-0 bottom-0 bg-pink-600 p-4'>
        <div className='flex justify-around'>
           <span className='nav-item active'><Link href="/dashboard"><House size={28} /></Link></span>
           <span className='nav-item text-white/50'><Link href="/portfolio"><ChartPie size={28} /></Link></span>
           <span className='nav-item text-white/50'><Link href="/search"><Search size={28} /></Link></span>
           <span className='nav-item text-white/50'><Link href="/profile"><User size={28} /></Link></span>
           <span className='nav-item text-white/50'><Link href="/menu"><Menu size={28} /></Link></span>
        </div>
      </nav>
    );
}