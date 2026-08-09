'use me';
'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { getCurrentUser } from '@/lib/dataService';
import { UserProfile, SEEDED_UNIVERSITIES } from '@/lib/seedData';
import ConstellationSVG from '@/components/ConstellationSVG';
import { User, ShieldCheck, Mail, Building, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) {
    return (
      <AppShell>
        <div className="p-8 text-center text-paper/50 font-mono">Loading profile...</div>
      </AppShell>
    );
  }

  const university = SEEDED_UNIVERSITIES.find((u) => u.id === user.university_id) || SEEDED_UNIVERSITIES[0];

  return (
    <AppShell>
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
        <div className="border-b border-paper/10 pb-6 space-y-2">
          <div className="flex items-center space-x-2 text-violet-mist font-mono text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>STUDENT FINGERPRINT PROFILE</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
            Account & Constellation Seal
          </h1>
        </div>

        <div className="p-8 rounded-3xl bg-ink-raised border border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center sm:text-left">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-signal/10 text-signal border border-signal/30 font-mono text-[10px] font-bold uppercase">
                ONBOARDED STUDENT
              </span>
              <h2 className="font-display font-bold text-2xl text-paper mt-2">{user.display_name}</h2>
            </div>

            <div className="space-y-2 text-xs font-mono text-paper/60">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Mail className="w-4 h-4 text-paper/40" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Building className="w-4 h-4 text-paper/40" />
                <span>{university.name}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-ink border border-paper/10 space-y-2">
            <ConstellationSVG
              seedData={{ seed: user.id.length * 111, depth_first: 0.8, overt_social: 0.5, truth_seeking: 0.8 }}
              width={140}
              height={140}
            />
            <span className="font-mono text-[10px] text-violet-mist font-bold">
              VERIFIED CONSTELLATION SEAL
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
