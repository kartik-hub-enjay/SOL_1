'use me';
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="bg-transparent w-full sticky top-0 z-50 py-6 sm:py-8 px-6 transition-all duration-300 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-2">
        <Link href="/" className="flex flex-col items-center justify-center group">
          <div className="relative h-24 sm:h-32 w-56 sm:w-72 transition-transform group-hover:scale-105">
            <Image
              src="/sol-logo.png"
              alt="SOL - Your Intellectual Home"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mono text-sm sm:text-base text-paper/80 tracking-widest lowercase mt-1">
            your intellectual home
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
