"use client";

import Link from 'next/link';
import { House, ChartPie, Search, User, Menu } from 'lucide-react';

export default function BottomNav() {
    return (
        <nav className='fixed left-0 right-0 bottom-0 bg-pink-600 p-4'>
        <div className='flex justify-around'>
           <span className='nav-item active'><Link href="/dashboard" className='text-white'><House size={28} /></Link></span>
           <span className='nav-item'><Link href="/portfolio" className='text-white/50'><ChartPie size={28} /></Link></span>
           <span className='nav-item'><Link href="/search" className='text-white/50'><Search size={28} /></Link></span>
           <span className='nav-item'><Link href="/profile" className='text-white/50'><User size={28} /></Link></span>
           <span className='nav-item'><Link href="/menu" className='text-white/50'><Menu size={28} /></Link></span>
        </div>
      </nav>
    );
}