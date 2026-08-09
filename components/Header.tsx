'use me';
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="bg-transparent w-full sticky top-0 z-50 py-1 sm:py-2 px-6 transition-all duration-300 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <Link href="/" className="flex flex-col items-center justify-center group">
          <div className="relative h-36 sm:h-52 w-80 sm:w-[440px] transition-transform group-hover:scale-105">
            <Image
              src="/sol-logo.png"
              alt="SOL Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
