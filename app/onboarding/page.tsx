'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser } from '@/lib/dataService';
import NeonMesh from '@/components/ui/neon-mesh';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

const INTEREST_TAGS = [
  { tag: 'web-dev', label: 'Web Dev' },
  { tag: 'poetry', label: 'Poetry' },
  { tag: 'cybersecurity', label: 'Cybersecurity' },
  { tag: 'design', label: 'Design' },
  { tag: 'debate', label: 'Debate' },
  { tag: 'music-production', label: 'Music Production' },
  { tag: 'robotics', label: 'Robotics' },
  { tag: 'creative-writing', label: 'Creative Writing' },
  { tag: 'data-science', label: 'Data Science' },
  { tag: 'dance', label: 'Dance' },
  { tag: 'other', label: 'Other' },
];

const SKILL_BASED_TAGS = ['web-dev', 'cybersecurity', 'design', 'robotics', 'data-science'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Form states
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [primaryInterest, setPrimaryInterest] = useState('web-dev');
  const [secondaryInterests, setSecondaryInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'building' | 'mentor'>('building');
  const [depthFirst, setDepthFirst] = useState<number>(0.7);
  const [overtSocial, setOvertSocial] = useState<number>(0.6);
  const [truthSeeking, setTruthSeeking] = useState<number>(0.8);

  const isSkillBased = SKILL_BASED_TAGS.includes(primaryInterest);
  const totalSteps = isSkillBased ? 8 : 7; // Q5 skipped if not skill based

  // Calculate actual Question Number (1..8)
  const getQuestionNumber = (currentStep: number) => {
    if (!isSkillBased && currentStep >= 5) return currentStep + 1;
    return currentStep;
  };

  const handleNext = () => {
    setError('');

    // Validation
    if (step === 1 && !q1.trim()) {
      setError('Please share a topic you could talk about.');
      return;
    }
    if (step === 2 && !q2.trim()) {
      setError('Please share a field you are curious about.');
      return;
    }

    if (step < totalSteps) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep((s) => s - 1);
  };

  const toggleSecondary = (tag: string) => {
    setSecondaryInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const user = getCurrentUser();

    // Deterministic seed generation
    let seed = 0;
    const combinedStr = q1 + q2 + primaryInterest + user.id;
    for (let i = 0; i < combinedStr.length; i++) {
      seed += combinedStr.charCodeAt(i) * (i + 1);
    }

    const profile = {
      primary_interest: primaryInterest,
      secondary_interests: secondaryInterests,
      skill_level: isSkillBased ? skillLevel : undefined,
      axis_scores: {
        depth_first: depthFirst,
        overt_social: overtSocial,
        truth_seeking: truthSeeking,
      },
      constellation_seed: {
        seed,
        depth_first: depthFirst,
        overt_social: overtSocial,
        truth_seeking: truthSeeking,
        primary_interest: primaryInterest,
      },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('spark_fingerprint_profile', JSON.stringify(profile));
    }

    const updatedUser = {
      ...user,
      onboarding_complete: true,
    };
    setCurrentUser(updatedUser);

    router.push('/onboarding/result');
  };

  const currentQNum = getQuestionNumber(step);

  return (
    <div className="relative min-h-screen w-full bg-[#050702] text-paper flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Home Screen Hero 3D Kinetic Verlet Canvas Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <NeonMesh
          showOverlayText={false}
          bgColor="#050702"
          baseMeshColor="101, 163, 13"
          neonLime="#BEF202"
          className="w-full h-full"
        />
      </div>

      {/* Black Glassmorphism Onboarding Card (Communities Card Style) */}
      <div className="relative z-10 w-full max-w-xl bg-black/85 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border border-paper/12 shadow-2xl overflow-hidden pointer-events-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-paper/10">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#2e4ed2]" />
            <span className="font-mono text-xs text-[#2e4ed2] uppercase tracking-wider font-bold">
              CURIOSITY & SKILL FINGERPRINT
            </span>
          </div>
          <span className="font-mono text-xs text-paper/50">
            QUESTION {currentQNum} OF {isSkillBased ? 8 : 8}
          </span>
        </div>

        {/* Progress bar with #ee9dd6 */}
        <div className="w-full bg-black/60 border border-paper/10 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-[#ee9dd6] h-full transition-all duration-300 rounded-full shadow-[0_0_10px_#ee9dd6]"
            style={{ width: `${(currentQNum / 8) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        {/* QUESTION 1 */}
        {currentQNum === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              What could you talk about for three hours without getting bored?
            </h2>
            <p className="text-xs text-paper/60 font-body">
              Be specific. Is it system design, 19th-century gothic poems, or low-level kernel bugs?
            </p>
            <textarea
              rows={4}
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
              placeholder="I could talk forever about..."
              className="w-full p-4 rounded-xl bg-black/70 border border-paper/12 text-paper text-sm focus:outline-none focus:border-[#2e4ed2] transition-colors placeholder:text-paper/40"
            />
          </div>
        )}

        {/* QUESTION 2 */}
        {currentQNum === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              What’s a field you know nothing about but are drawn to understanding?
            </h2>
            <p className="text-xs text-paper/60 font-body">
              Something outside your major that quietly fascinates you.
            </p>
            <textarea
              rows={4}
              value={q2}
              onChange={(e) => setQ2(e.target.value)}
              placeholder="I’m drawn to understanding..."
              className="w-full p-4 rounded-xl bg-black/70 border border-paper/12 text-paper text-sm focus:outline-none focus:border-[#2e4ed2] transition-colors placeholder:text-paper/40"
            />
          </div>
        )}

        {/* QUESTION 3 */}
        {currentQNum === 3 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              Pick your primary interest right now.
            </h2>
            <p className="text-xs text-paper/60 font-body">
              This anchors your initial Community & Starter Pod match.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {INTEREST_TAGS.map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => setPrimaryInterest(item.tag)}
                  className={`p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer flex items-center justify-between ${
                    primaryInterest === item.tag
                      ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                      : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                  }`}
                >
                  <span>{item.label}</span>
                  {primaryInterest === item.tag && <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4ed2]" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 4 */}
        {currentQNum === 4 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              Anything else you’re into?
            </h2>
            <p className="text-xs text-paper/60 font-body">
              Multi-select optional secondary interests to broaden your crowd.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {INTEREST_TAGS.filter((t) => t.tag !== primaryInterest).map((item) => {
                const selected = secondaryInterests.includes(item.tag);
                return (
                  <button
                    key={item.tag}
                    type="button"
                    onClick={() => toggleSecondary(item.tag)}
                    className={`p-3 rounded-xl border text-xs font-mono text-left transition-all cursor-pointer flex items-center justify-between ${
                      selected
                        ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                        : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2e4ed2]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTION 5 (Conditional for skill-based) */}
        {currentQNum === 5 && isSkillBased && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              Where are you right now in {primaryInterest}?
            </h2>
            <p className="text-xs text-paper/60 font-body">
              Self-declared baseline for peer matching.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { level: 'beginner', label: 'Just starting', desc: 'Learning fundamentals and experimenting' },
                { level: 'building', label: 'Building real things', desc: 'Shipping projects and solving real obstacles' },
                { level: 'mentor', label: 'Could mentor others', desc: 'Experienced and ready to guide peers' },
              ].map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSkillLevel(opt.level as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    skillLevel === opt.level
                      ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                      : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                  }`}
                >
                  <div className="font-display font-bold text-sm text-paper">{opt.label}</div>
                  <div className="text-xs text-paper/50 font-body mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 6 */}
        {currentQNum === 6 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              Would you rather go deep on one problem for a week, or touch five loosely related ideas?
            </h2>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setDepthFirst(0.9)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  depthFirst === 0.9
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Go deep on one problem</div>
                <div className="text-xs text-paper/50 font-body mt-1">Sustained focus, exhaustive depth</div>
              </button>
              <button
                type="button"
                onClick={() => setDepthFirst(0.3)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  depthFirst === 0.3
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Explore five loose ideas</div>
                <div className="text-xs text-paper/50 font-body mt-1">Cross-pollination, rapid breadth</div>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 7 */}
        {currentQNum === 7 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              When you’re excited about an idea, do you want to talk it through immediately, or think it through alone first?
            </h2>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setOvertSocial(0.9)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  overtSocial === 0.9
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Talk it through immediately</div>
                <div className="text-xs text-paper/50 font-body mt-1">Soundboard with peers in realtime</div>
              </button>
              <button
                type="button"
                onClick={() => setOvertSocial(0.2)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  overtSocial === 0.2
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Think it through alone first</div>
                <div className="text-xs text-paper/50 font-body mt-1">Formulate thoughts quietly before sharing</div>
              </button>
            </div>
          </div>
        )}

        {/* QUESTION 8 */}
        {currentQNum === 8 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-paper">
              Do you care more about being right, or the conversation going somewhere interesting even if you’re proven wrong?
            </h2>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setTruthSeeking(0.9)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  truthSeeking === 0.9
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Going somewhere interesting</div>
                <div className="text-xs text-paper/50 font-body mt-1">Value creative momentum & discovery</div>
              </button>
              <button
                type="button"
                onClick={() => setTruthSeeking(0.4)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  truthSeeking === 0.4
                    ? 'bg-[#2e4ed2]/20 border-[#2e4ed2] text-white font-bold'
                    : 'bg-black/70 border-paper/12 text-paper/70 hover:border-paper/30 hover:text-paper'
                }`}
              >
                <div className="font-display font-bold text-sm text-paper">Rigorous correctness</div>
                <div className="text-xs text-paper/50 font-body mt-1">Value precision & verified logic</div>
              </button>
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-paper/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-black/70 border border-paper/12 hover:border-paper/30 text-paper text-xs font-mono flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-[#2e4ed2] hover:bg-[#2e4ed2]/90 text-white font-display font-bold text-sm flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-[#2e4ed2]/20"
          >
            <span>{step === totalSteps ? 'Generate Fingerprint' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
