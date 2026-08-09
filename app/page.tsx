'use me';
'use client';

import Link from 'next/link';
import ConstellationSVG from '@/components/ConstellationSVG';
import NeonMesh from '@/components/ui/neon-mesh';
import Header from '@/components/Header';
import { SEEDED_COMMUNITIES } from '@/lib/seedData';
import { Sparkles, ArrowRight, Compass, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const steps = [
    {
      num: '01',
      title: 'Answer a few questions',
      desc: 'Short curiosity questionnaire generating your deterministic SVG fingerprint seal.',
    },
    {
      num: '02',
      title: 'Join your communities',
      desc: 'Explore open interest spaces from Web Dev to Spoken Word Poetry across campuses.',
    },
    {
      num: '03',
      title: 'Your circle finds you',
      desc: 'A trusted pod of 5–8 matched peers quietly forms inside each community.',
    },
    {
      num: '04',
      title: 'Grow toward the National Guild',
      desc: 'Consistent substantive engagement promotes your pod up the cross-India ladder.',
    },
  ];

  const problemStatements = [
    'You are surrounded by hundreds of classmates, but nobody in your dorm wants to debate kernel drivers or analyze 19th-century stanzas at 1 AM.',
    'Exam ranks and room allocations assign who you sit next to, not who actually shares your obsessive drive.',
    'Generic student clubs turn into broadcast announcement channels where nobody forms real working relationships.',
  ];

  return (
    <div className="relative min-h-screen bg-[#050702] text-paper selection:bg-ember selection:text-ink flex flex-col overflow-x-hidden">
      {/* 3D Kinetic Verlet Canvas Full Screen Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <NeonMesh
          showOverlayText={false}
          bgColor="#050702"
          baseMeshColor="101, 163, 13"
          neonLime="#BEF202"
          className="w-full h-full"
        />
      </div>

      {/* Foreground Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
        {/* Top Header Navbar */}
        <Header />

        {/* HERO SECTION — Asymmetric Layout over 3D Mesh */}
        <section className="px-6 py-12 md:py-24 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (7 cols): Headline + CTA */}
          <div className="lg:col-span-7 space-y-6 bg-[#0F1024]/70 p-8 rounded-3xl border border-paper/10 backdrop-blur-md shadow-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>INTEREST-FIRST STUDENT MATCHING</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl text-paper tracking-tight leading-[1.1]">
              Find the crowd that <span className="text-ember">gets it</span>.
            </h1>

            <p className="text-base sm:text-lg text-paper/80 font-body leading-relaxed max-w-xl">
              Stop being stuck with whoever your exam rank and hostel room assigned you. Join open interest Communities, form a trusted 6-person Circle, and climb toward the National Guild.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="py-4 px-8 rounded-2xl bg-ember text-ink font-display font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-xl shadow-ember/20 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="py-4 px-8 rounded-2xl bg-ink-raised border border-paper/10 text-paper font-mono text-xs flex items-center justify-center hover:border-paper/30 transition-colors"
              >
                Explore Demo Logins
              </Link>
            </div>

            <div className="pt-4 flex items-center space-x-6 text-xs font-mono text-paper/60">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#BEF202]" />
                <span>No Marks Required</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#BEF202]" />
                <span>Cross-Campus Guild</span>
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Signature Constellation Seal Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="p-8 rounded-3xl bg-[#0F1024]/80 border border-paper/10 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 left-0 w-48 h-48 bg-[#BEF202]/10 rounded-full blur-3xl pointer-events-none" />
              <ConstellationSVG
                seedData={{ seed: 998877, depth_first: 0.8, overt_social: 0.6, truth_seeking: 0.9 }}
                width={280}
                height={280}
                animate={true}
              />
              <div className="mt-4 font-mono text-[10px] text-[#BEF202] uppercase tracking-widest text-center font-bold">
                SIGNATURE FINGERPRINT CONSTELLATION
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="px-6 py-16 bg-[#0F1024]/60 border-y border-paper/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="font-mono text-xs text-ember uppercase tracking-wider">THE REAL PROBLEM</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-paper">
                College assigns your room. It shouldn’t limit your crowd.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {problemStatements.map((statement, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#050702]/80 border border-paper/10 backdrop-blur-sm space-y-3 relative overflow-hidden"
                >
                  <span className="font-mono text-xs font-bold text-[#BEF202]">0{idx + 1}</span>
                  <p className="text-sm text-paper/80 font-body leading-relaxed">{statement}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="px-6 py-16 max-w-7xl mx-auto w-full space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="font-mono text-xs text-[#BEF202] uppercase tracking-wider font-bold">HOW SPARK WORKS</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-paper">
              From curiosity answer to National Guild.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-2xl bg-[#0F1024]/70 border border-paper/10 backdrop-blur-md space-y-3 relative"
              >
                <div className="w-10 h-10 rounded-xl bg-[#050702] border border-paper/10 flex items-center justify-center font-mono text-sm font-bold text-[#BEF202]">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-lg text-paper">{step.title}</h3>
                <p className="text-xs text-paper/60 font-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* INTEREST SHOWCASE GRID */}
        <section className="px-6 py-16 bg-[#0F1024]/60 border-t border-paper/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-violet-mist uppercase tracking-wider">INTEREST SHOWCASE</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-paper">
                  10 Active Communities & Pods
                </h2>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center space-x-1.5 font-mono text-xs text-ember hover:underline font-bold"
              >
                <span>Explore All Spaces</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {SEEDED_COMMUNITIES.map((comm) => (
                <div
                  key={comm.id}
                  className="p-4 rounded-xl bg-[#050702]/80 border border-paper/10 space-y-2 hover:border-paper/20 transition-all backdrop-blur-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: comm.cover_accent }}
                  />
                  <h3 className="font-display font-bold text-sm text-paper truncate">{comm.name}</h3>
                  <p className="font-mono text-[10px] text-paper/40">#{comm.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA & FOOTER */}
        <footer className="mt-auto border-t border-paper/10 bg-[#050702]/90 backdrop-blur-md px-6 py-12 text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-3xl text-paper">Ready to find your crowd?</h2>
            <p className="text-xs text-paper/60 font-body">
              Take the 2-minute fingerprint questionnaire and join your Starter Pod tonight.
            </p>
            <Link
              href="/signup"
              className="inline-flex py-3.5 px-8 rounded-xl bg-ember text-ink font-display font-bold text-sm items-center space-x-2 hover:opacity-90 transition-opacity shadow-lg shadow-ember/20 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-6 border-t border-paper/10 text-xs font-mono text-paper/40">
            Spark MVP © 2026 · Built for autonomous build spec verification.
          </div>
        </footer>
      </div>
    </div>
  );
}
