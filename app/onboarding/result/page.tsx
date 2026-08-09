'use me';
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConstellationSVG, { ConstellationSeed } from '@/components/ConstellationSVG';
import { getCommunities, toggleCommunityMembership, getJoinedCommunityIds, getCurrentUser } from '@/lib/dataService';
import { Community, UserProfile } from '@/lib/seedData';
import { Sparkles, ArrowRight, Check, Shield } from 'lucide-react';

export default function OnboardingResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [seedData, setSeedData] = useState<ConstellationSeed>({
    seed: 12345,
    depth_first: 0.7,
    overt_social: 0.6,
    truth_seeking: 0.8,
  });
  const [primaryInterest, setPrimaryInterest] = useState('web-dev');
  const [skillLevel, setSkillLevel] = useState<string | undefined>('building');
  const [recommended, setRecommended] = useState<Community[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setJoinedIds(getJoinedCommunityIds());

    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('spark_fingerprint_profile');
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.constellation_seed) setSeedData(parsed.constellation_seed);
          if (parsed.primary_interest) setPrimaryInterest(parsed.primary_interest);
          if (parsed.skill_level) setSkillLevel(parsed.skill_level);
        } catch {}
      }
    }

    getCommunities().then((allComms) => {
      const matched = allComms.filter(
        (c) => c.tag === primaryInterest || c.tag === 'cybersecurity' || c.tag === 'design'
      );
      setRecommended(matched.length > 0 ? matched : allComms.slice(0, 3));
    });
  }, [primaryInterest]);

  const handleJoin = (commId: string) => {
    const next = toggleCommunityMembership(commId);
    setJoinedIds([...next]);
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-ink-raised p-6 sm:p-10 rounded-3xl border border-paper/10 shadow-2xl space-y-8">
        
        {/* Header payoff */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-signal/10 border border-signal/30 text-signal font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FINGERPRINT GENERATED</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
            Your Spark Constellation
          </h1>
          <p className="text-sm text-paper/70 font-body max-w-md mx-auto">
            Your unique curiosity fingerprint made visible. This seal anchors your small Circle matching inside every Community.
          </p>
        </div>

        {/* Constellation SVG display */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-ink border border-paper/10 relative overflow-hidden">
          <ConstellationSVG seedData={seedData} width={260} height={260} animate={true} />
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-ink-raised border border-ember/30 font-mono text-xs text-ember">
              PRIMARY · {primaryInterest.toUpperCase()}
            </div>
            {skillLevel && (
              <div className="px-3 py-1 rounded-lg bg-ink-raised border border-signal/30 font-mono text-xs text-signal">
                LEVEL · {skillLevel.toUpperCase()}
              </div>
            )}
            <div className="px-3 py-1 rounded-lg bg-ink-raised border border-violet-mist/30 font-mono text-xs text-violet-mist">
              SEED · #{seedData.seed}
            </div>
          </div>
        </div>

        {/* Recommended Communities */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-paper flex items-center justify-between">
            <span>Recommended Communities for You</span>
            <span className="font-mono text-xs text-paper/50 font-normal">MATCHED BY FINGERPRINT</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommended.map((comm) => {
              const isJoined = joinedIds.includes(comm.id);
              return (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl bg-ink border border-paper/10 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: comm.cover_accent }}
                      />
                      <span className="font-display font-bold text-sm text-paper">{comm.name}</span>
                    </div>
                    <p className="text-xs text-paper/60 line-clamp-2">{comm.description}</p>
                  </div>

                  <button
                    onClick={() => handleJoin(comm.id)}
                    className={`py-2 px-4 rounded-lg font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      isJoined
                        ? 'bg-signal/20 text-signal border border-signal/40'
                        : 'bg-paper/10 text-paper hover:bg-paper/20 border border-paper/10'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <span>Join Community</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA */}
        <button
          onClick={() => router.push('/communities')}
          className="w-full py-4 px-6 rounded-2xl bg-ember hover:opacity-90 text-ink font-display font-bold text-base flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl shadow-ember/15"
        >
          <span>Continue to Spark</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
