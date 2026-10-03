'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('prompt-builder')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" onClick={handleHomeClick} className="text-xl font-extrabold tracking-tight flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-teal to-accent-cyan flex items-center justify-center text-bg-main shadow-md shadow-accent-teal/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-sm font-black">Y</span>
          </div>
          <span className="text-zinc-100 group-hover:text-accent-teal transition-colors">yours<span className="bg-gradient-to-r from-accent-teal to-accent-cyan bg-clip-text text-transparent">prompt</span><span className="text-zinc-500 font-normal">.com</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === '/' ? 'text-accent-teal' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Home
            {pathname === '/' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-teal rounded-full" />
            )}
          </Link>
          <Link
            href="/how-it-works"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === '/how-it-works' ? 'text-accent-teal' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            How It Works
            {pathname === '/how-it-works' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-teal rounded-full" />
            )}
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === '/about' ? 'text-accent-teal' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            About
            {pathname === '/about' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-teal rounded-full" />
            )}
          </Link>
          <Link
            href="/pricing"
            className={`text-sm font-medium transition-colors relative py-1 ${
              pathname === '/pricing' ? 'text-accent-teal' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pricing
            {pathname === '/pricing' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-teal rounded-full" />
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
