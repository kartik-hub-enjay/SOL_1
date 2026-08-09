'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setCurrentUser } from '@/lib/dataService';
import { SEEDED_STUDENTS, ADMIN_USER, UserProfile } from '@/lib/seedData';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (email.toLowerCase() === 'admin@spark.edu') {
        setCurrentUser(ADMIN_USER);
        router.push('/admin');
        return;
      }

      const foundStudent = SEEDED_STUDENTS.find(
        (s) => s.email.toLowerCase() === email.toLowerCase()
      );

      if (foundStudent) {
        setCurrentUser(foundStudent);
        router.push(foundStudent.onboarding_complete ? '/communities' : '/onboarding');
      } else if (email.includes('@') && password.length >= 6) {
        const customUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          display_name: email.split('@')[0],
          university_id: 'uni-1',
          created_at: new Date().toISOString(),
          onboarding_complete: false,
        };
        setCurrentUser(customUser);
        router.push('/onboarding');
      } else {
        setError('Invalid credentials. Try a demo account or sign up.');
        setLoading(false);
      }
    }, 400);
  };

  const handleDemoSelect = (user: UserProfile, redirectPath?: string) => {
    setCurrentUser(user);
    router.push(redirectPath || (user.onboarding_complete ? '/communities' : '/onboarding'));
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-ink-raised p-8 rounded-2xl border border-paper/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-signal/10 border border-signal/30 flex items-center justify-center text-signal">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-paper tracking-tight">Welcome back to Spark</h1>
            <p className="text-xs text-paper/60 font-mono">ENTER YOUR STUDENT CREDENTIALS</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-paper/70 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="student1@silveroak.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-signal transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-paper/70 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-signal transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-signal hover:opacity-90 text-ink font-display font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-signal/10"
          >
            <span>{loading ? 'Authenticating...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-paper/10">
          <p className="text-xs font-mono text-paper/50 uppercase tracking-wider mb-3">Quick Demo Logins</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSelect(SEEDED_STUDENTS[0])}
              className="p-2.5 rounded-lg bg-ink border border-paper/10 hover:border-signal/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-paper flex items-center justify-between">
                <span>{SEEDED_STUDENTS[0].display_name}</span>
                <UserCheck className="w-3 h-3 text-signal" />
              </div>
              <div className="text-[10px] font-mono text-paper/40 truncate">Web Dev · Onboarded</div>
            </button>

            <button
              onClick={() => handleDemoSelect(ADMIN_USER, '/admin')}
              className="p-2.5 rounded-lg bg-ink border border-paper/10 hover:border-violet-mist/50 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-bold text-paper flex items-center justify-between">
                <span>Admin View</span>
                <UserCheck className="w-3 h-3 text-violet-mist" />
              </div>
              <div className="text-[10px] font-mono text-paper/40 truncate">University Dean</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-paper/50">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-ember hover:underline font-mono">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
