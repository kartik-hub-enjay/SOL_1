'use me';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const MenuIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const pathname = usePathname();

  useEffect(() => {
    // Sync theme setting
    const stored = localStorage.getItem('spark_theme');
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('spark_theme', next);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/communities', label: 'Communities' },
    { href: '/journey', label: 'Journey' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/admin', label: 'Admin View' },
  ];

  return (
    <header className="bg-[#050702]/85 border-b border-paper/10 backdrop-blur-md sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-ember/15 border border-ember/30 flex items-center justify-center text-ember group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-display font-bold text-paper tracking-tight">Spark</span>
                <span className="block font-mono text-[9px] text-[#BEF202] uppercase tracking-widest leading-none">
                  Student Guild
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-mono transition-colors duration-300 ${
                    isActive
                      ? 'text-[#BEF202] font-bold'
                      : 'text-paper/70 hover:text-paper'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button, Theme Toggle and Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center justify-center rounded-xl text-xs font-display font-bold h-10 px-4 py-2 bg-ember text-ink hover:opacity-90 shadow-lg shadow-ember/20 transition-all duration-300 cursor-pointer"
            >
              Get Started
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-paper/70 hover:text-[#BEF202] hover:bg-ink-raised focus:outline-none border border-paper/10 transition-colors duration-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 text-[#BEF202]" />
              ) : (
                <MoonIcon className="h-5 w-5 text-ember" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-paper/70 hover:text-paper hover:bg-ink-raised focus:outline-none border border-paper/10 transition-colors duration-300 cursor-pointer"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <XIcon className="h-5 w-5 text-paper" /> : <MenuIcon className="h-5 w-5 text-paper" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown (Sheet) */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-paper/10 bg-[#050702]/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200" id="mobile-menu">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-mono transition-colors duration-300 ${
                    isActive
                      ? 'bg-ember/15 text-[#BEF202] font-bold border border-ember/30'
                      : 'text-paper/70 hover:bg-ink-raised hover:text-paper'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="w-full mt-3 text-center items-center justify-center rounded-xl text-sm font-display font-bold h-11 px-4 py-2.5 bg-ember text-ink hover:opacity-90 block transition-all duration-300 shadow-lg shadow-ember/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
