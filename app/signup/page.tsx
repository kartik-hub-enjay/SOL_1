'use me';
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUniversities, setCurrentUser } from '@/lib/dataService';
import { University, UserProfile } from '@/lib/seedData';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = Router();
  const [universities, setUniversities] = useState<University[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function Router() {
    return useRouter();
  }

  useEffect(() => {
    getUniversities().then((unis) => {
      setUniversities(unis);
      if (unis.length > 0) setUniversityId(unis[0].id);
    });
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !displayName || !universityId) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        display_name: displayName,
        university_id: universityId,
        created_at: new Date().toISOString(),
        onboarding_complete: false,
      };

      setCurrentUser(newUser);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-ink-raised p-8 rounded-2xl border border-paper/10 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-ember/10 border border-ember/30 flex items-center justify-center text-ember">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-paper tracking-tight">Create your Spark account</h1>
            <p className="text-xs text-paper/60 font-mono">STEP 1 OF 2 · STUDENT VERIFICATION</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-paper/70 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-paper/70 uppercase tracking-wider mb-2">University / Institution</label>
            <select
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-ember transition-colors"
            >
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id} className="bg-ink text-paper">
                  {uni.name} ({uni.domain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-paper/70 uppercase tracking-wider mb-2">Student Email</label>
            <input
              type="email"
              required
              placeholder="you@college.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-ember transition-colors"
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
              className="w-full px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-ember transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-ember hover:opacity-90 text-ink font-display font-bold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-ember/10"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-paper/50">
          Already have an account?{' '}
          <Link href="/login" className="text-signal hover:underline font-mono">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
