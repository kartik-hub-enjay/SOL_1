'use me';
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="bg-transparent w-full sticky top-0 z-50 py-6 px-6 transition-all duration-300 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-1.5">
        <Link href="/" className="flex flex-col items-center justify-center group">
          <div className="relative h-14 sm:h-16 w-36 sm:w-44 transition-transform group-hover:scale-105">
            <Image
              src="/sol-logo.png"
              alt="SOL - Your Intellectual Home"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mono text-xs sm:text-sm text-paper/70 tracking-widest lowercase mt-1">
            your intellectual home
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
