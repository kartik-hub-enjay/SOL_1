'use me';
'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { getCurrentUser, getCircleMessages } from '@/lib/dataService';
import { UserProfile, CircleMessage } from '@/lib/seedData';
import ConstellationSVG from '@/components/ConstellationSVG';
import { TrendingUp, Award, Sparkles, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';

const TIERS = [
  {
    key: 'starter_pod',
    name: 'Starter Pod',
    code: 'TIER_01 · LOCAL',
    desc: 'Small trusted pod of 5–8 peers forming inside your primary interest community.',
    threshold: 0,
    accent: '#FF7A45',
  },
  {
    key: 'home_circle',
    name: 'Home Circle',
    keyTag: 'home_circle',
    code: 'TIER_02 · COMMUNITY',
    desc: 'Established interest group with sustained weekly discussions and shared project logs.',
    threshold: 35,
    accent: '#8C87F2',
  },
  {
    key: 'regional_circle',
    name: 'Regional Circle',
    code: 'TIER_03 · STATE',
    desc: 'Cross-campus network connecting active builders and writers across neighboring hubs.',
    threshold: 70,
    accent: '#7CF5D6',
  },
  {
    key: 'national_guild',
    name: 'National Guild',
    code: 'TIER_04 · ALL-INDIA',
    desc: 'The small cross-India guild of the most dedicated people in this interest — regardless of college or marks.',
    threshold: 120,
    accent: '#FF7A45',
  },
];

export default function JourneyPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [score, setScore] = useState<number>(25);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Compute live engagement score from message activity
    getCircleMessages('web-dev').then((msgs) => {
      setMessages(msgs);
      const userMsgs = msgs.filter((m) => m.user_id === currentUser.id);
      
      let computedScore = 20 + userMsgs.length * 15;
      userMsgs.forEach((m) => {
        if (m.content.length > 40) computedScore += 10;
      });

      setScore(Math.min(computedScore, 150));
    });
  }, []);

  // Determine current tier from score
  const currentTierIndex = TIERS.reduce((acc, tier, idx) => {
    if (score >= tier.threshold) return idx;
    return acc;
  }, 0);

  const currentTier = TIERS[currentTierIndex];

  return (
    <AppShell>
      <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-paper/10 pb-6 space-y-2">
          <div className="flex items-center space-x-2 text-signal font-mono text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>TIER PROGRESSION LADDER</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
            Your Spark Journey
          </h1>
          <p className="text-sm text-paper/60 font-body max-w-xl">
            Engagement moves you up the ladder toward the National Guild. No marks, no college rank — only consistent, substantive contribution.
          </p>
        </div>

        {/* Current Score & Status Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ink-raised border border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-mono text-xs text-paper/50 uppercase tracking-widest">
              LIVE ENGAGEMENT SCORE
            </div>
            <div className="flex items-baseline space-x-3">
              <span className="font-display font-bold text-5xl text-paper tracking-tight">{score}</span>
              <span className="font-mono text-xs text-signal">PTS / WEEK</span>
            </div>
            <p className="text-xs text-paper/60 font-body">
              Calculated live from {messages.length} messages and substantive responses in your active Circle.
            </p>
          </div>

          {/* Pulse Constellation Seal */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <ConstellationSVG
                seedData={{ seed: score * 12, depth_first: 0.8, overt_social: 0.6, truth_seeking: 0.9 }}
                width={120}
                height={120}
                animate={true}
              />
            </div>
            <span className="font-mono text-[10px] text-ember uppercase tracking-wider font-bold">
              CURRENT TIER: {currentTier.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Visual Ladder Sequence */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-xl text-paper flex items-center space-x-2">
            <Layers className="w-5 h-5 text-ember" />
            <span>The Tier Ladder</span>
          </h2>

          <div className="space-y-4">
            {TIERS.map((tier, idx) => {
              const isCurrent = idx === currentTierIndex;
              const isAchieved = idx <= currentTierIndex;

              return (
                <div
                  key={tier.key}
                  className={`p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-ink-raised border-ember/50 shadow-xl shadow-ember/5'
                      : isAchieved
                      ? 'bg-ink-raised/60 border-paper/10 opacity-80'
                      : 'bg-ink/40 border-paper/5 opacity-50'
                  }`}
                >
                  <div className="space-y-1.5 max-w-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-[10px] text-paper/50 uppercase tracking-widest">
                        {tier.code}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-ember/20 border border-ember/40 text-ember font-mono text-[10px] font-bold">
                          ACTIVE TIER
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-xl text-paper flex items-center space-x-2">
                      <span>{tier.name}</span>
                      {isAchieved && <CheckCircle2 className="w-4 h-4 text-signal shrink-0" />}
                    </h3>

                    <p className="text-xs text-paper/60 font-body leading-relaxed">{tier.desc}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-paper/10 pt-3 sm:pt-0">
                    <span className="font-mono text-xs text-paper/40">THRESHOLD</span>
                    <span className="font-mono text-sm font-bold text-paper">{tier.threshold} PTS</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guild Principles Banner */}
        <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 flex items-start space-x-4">
          <Award className="w-6 h-6 text-signal shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-display font-bold text-sm text-paper">How Progression Works</h4>
            <p className="text-xs text-paper/60 font-body leading-relaxed">
              Every substantive contribution to your Circle chat increases your weekly engagement score. Consistent high engagement over time promotes your Pod into the National Guild, connecting you directly with India’s top builders in your field.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
