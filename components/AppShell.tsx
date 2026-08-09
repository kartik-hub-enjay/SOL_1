'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/dataService';
import { UserProfile } from '@/lib/seedData';
import ConstellationSVG from './ConstellationSVG';
import Dock from '@/components/ui/dock';
import {
  Compass,
  MessageSquare,
  TrendingUp,
  Award,
  User,
  LogOut,
  Shield,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spark_current_user');
    }
    router.push('/login');
  };

  const isAdmin = user?.email?.toLowerCase() === 'admin@spark.edu' || user?.email?.toLowerCase() === 'admin@sol.edu';

  const dockItems = [
    {
      icon: Compass,
      label: 'Communities',
      onClick: () => router.push('/communities'),
      active: pathname.startsWith('/communities'),
    },
    {
      icon: MessageSquare,
      label: 'My Circle',
      onClick: () => router.push('/circle'),
      active: pathname.startsWith('/circle'),
    },
    {
      icon: TrendingUp,
      label: 'Journey',
      onClick: () => router.push('/journey'),
      active: pathname.startsWith('/journey'),
    },
    {
      icon: Award,
      label: 'Opportunities',
      onClick: () => router.push('/opportunities'),
      active: pathname.startsWith('/opportunities'),
    },
    {
      icon: User,
      label: 'Profile',
      onClick: () => router.push('/profile'),
      active: pathname.startsWith('/profile'),
    },
    ...(isAdmin
      ? [
          {
            icon: Shield,
            label: 'Admin Dashboard',
            onClick: () => router.push('/admin'),
            active: pathname.startsWith('/admin'),
          },
        ]
      : []),
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: handleLogout,
      active: false,
    },
  ];

  const navItems = [
    { href: '/communities', label: 'Communities', icon: Compass },
    { href: '/circle', label: 'My Circle', icon: MessageSquare },
    { href: '/journey', label: 'Journey', icon: TrendingUp },
    { href: '/opportunities', label: 'Opportunities', icon: Award },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#050702] text-paper flex flex-col md:flex-row">
      {/* Desktop Left Rail Navigation (md:flex) with Vertical Dock */}
      <aside className="hidden md:flex flex-col w-28 bg-ink-raised/80 backdrop-blur-xl border-r border-paper/10 min-h-screen py-6 px-2 sticky top-0 h-screen justify-between items-center z-30">
        {/* Brand header */}
        <Link href="/communities" className="flex flex-col items-center space-y-1 group">
          <div className="relative h-10 w-16 transition-transform group-hover:scale-105">
            <Image
              src="/sol-logo.png"
              alt="SOL Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mono text-[8px] text-[#BEF202] uppercase tracking-widest leading-none text-center">
            Guild
          </span>
        </Link>

        {/* User seal badge */}
        {user && (
          <div className="p-2 rounded-xl bg-ink border border-paper/10 flex flex-col items-center justify-center" title={user.display_name}>
            <ConstellationSVG
              seedData={{ seed: user.id.length * 99, depth_first: 0.8, overt_social: 0.5, truth_seeking: 0.7 }}
              width={32}
              height={32}
              seal={true}
            />
          </div>
        )}

        {/* Vertical Dock Component */}
        <Dock items={dockItems} orientation="vertical" tooltipSide="right" className="py-2" />

        <div className="text-[10px] font-mono text-paper/30 text-center">
          SOL v1.0
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8">{children}</main>

      {/* Mobile Bottom Tab Bar (< md:flex) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ink-raised border-t border-paper/10 px-4 py-2 flex items-center justify-around z-40 backdrop-blur-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-[10px] font-mono transition-colors ${
                isActive ? 'text-[#BEF202] font-bold' : 'text-paper/50 hover:text-paper'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#BEF202]' : 'text-paper/50'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

