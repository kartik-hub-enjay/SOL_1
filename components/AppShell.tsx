'use me';
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/dataService';
import { UserProfile } from '@/lib/seedData';
import ConstellationSVG from './ConstellationSVG';
import {
  Compass,
  MessageSquare,
  TrendingUp,
  Award,
  User,
  LogOut,
  Sparkles,
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

  const navItems = [
    { href: '/communities', label: 'Communities', icon: Compass },
    { href: '/circle', label: 'My Circle', icon: MessageSquare },
    { href: '/journey', label: 'Journey', icon: TrendingUp },
    { href: '/opportunities', label: 'Opportunities', icon: Award },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const isAdmin = user?.email?.toLowerCase() === 'admin@spark.edu';

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col md:flex-row">
      {/* Desktop Left Rail Navigation (md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-raised border-r border-paper/10 min-h-screen p-6 sticky top-0 h-screen justify-between z-30">
        <div className="space-y-8">
          {/* Brand header */}
          <Link href="/communities" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-ember/15 border border-ember/30 flex items-center justify-center text-ember group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-paper tracking-tight">Spark</span>
              <span className="block font-mono text-[10px] text-paper/40 uppercase tracking-widest">
                Student Guild
              </span>
            </div>
          </Link>

          {/* User seal badge */}
          {user && (
            <div className="p-3 rounded-xl bg-ink border border-paper/10 flex items-center space-x-3">
              <ConstellationSVG
                seedData={{ seed: user.id.length * 99, depth_first: 0.8, overt_social: 0.5, truth_seeking: 0.7 }}
                width={36}
                height={36}
                seal={true}
              />
              <div className="overflow-hidden">
                <div className="font-display font-bold text-xs text-paper truncate">
                  {user.display_name}
                </div>
                <div className="font-mono text-[10px] text-signal truncate">
                  Starter Pod Member
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
                    isActive
                      ? 'bg-ember/15 text-ember font-bold border border-ember/30 shadow-md shadow-ember/5'
                      : 'text-paper/70 hover:bg-ink hover:text-paper border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-ember' : 'text-paper/60'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-mono text-xs transition-all ${
                  pathname.startsWith('/admin')
                    ? 'bg-violet-mist/20 text-violet-mist font-bold border border-violet-mist/40'
                    : 'text-violet-mist/70 hover:bg-ink hover:text-violet-mist border border-transparent'
                }`}
              >
                <Shield className="w-4 h-4 text-violet-mist" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl font-mono text-xs text-paper/50 hover:text-red-400 hover:bg-ink border border-transparent transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
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
                isActive ? 'text-ember font-bold' : 'text-paper/50 hover:text-paper'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-ember' : 'text-paper/50'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
