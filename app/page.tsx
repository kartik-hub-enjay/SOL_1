'use me';
'use client';

import React from 'react';
import Header from '@/components/Header';
import NeonMesh from '@/components/ui/neon-mesh';
import GetStartedButton from '@/components/GetStartedButton';

export default function LandingPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050702] text-paper flex flex-col justify-between items-center select-none">
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

      {/* Reduced Height Transparent Header with Larger Logo */}
      <Header />

      {/* Hero Content Section - Centered, No Scroll */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto space-y-8 pointer-events-auto">
        {/* Title text in ALL CAPITAL, 700 weight, with #ee9dd6 outline on hover (no color change) */}
        <h1
          className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-paper tracking-tight leading-tight uppercase hover-stroke-ee9dd6 cursor-pointer select-none"
          style={{ fontFamily: 'Product Sans, var(--font-space-grotesk), sans-serif', fontWeight: 700 }}
        >
          SMART DOESN&apos;T HAVE TO BE LONELY.
        </h1>

        {/* Custom #2e4ed2 / #ee9dd6 Get Started Button */}
        <div className="pt-2">
          <GetStartedButton text="Get started" href="/signup" />
        </div>
      </main>

      {/* Subtle Footer Tagline */}
      <footer className="relative z-10 py-3 font-mono text-[10px] text-paper/40 tracking-widest uppercase">
        SOL · YOUR INTELLECTUAL HOME
      </footer>
    </div>
  );
}
