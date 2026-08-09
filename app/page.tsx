'use me';
'use client';

import React from 'react';
import CardNav from '@/components/CardNav';
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

      {/* CardNav React Bits Navbar */}
      <CardNav
        logo="/sol-logo.png"
        logoAlt="SOL Logo"
        baseColor="rgba(15, 16, 36, 0.85)"
        menuColor="#BEF202"
        buttonBgColor="#FF7A45"
        buttonTextColor="#0F1024"
      />

      {/* Hero Content Section - Centered, No Scroll */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto space-y-8 pointer-events-auto">
        {/* Title text in 700 weight with low opacity thick shadow on hover */}
        <h1
          className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-paper tracking-tight leading-tight transition-all duration-300 hover:text-amber-100 hover:drop-shadow-[0_20px_35px_rgba(255,122,69,0.35)] cursor-pointer select-none"
          style={{ fontFamily: 'Product Sans, var(--font-space-grotesk), sans-serif', fontWeight: 700 }}
        >
          Smart doesn&apos;t have to be lonely.
        </h1>

        {/* Get Started Button */}
        <div className="pt-2">
          <GetStartedButton text="Get started" href="/signup" />
        </div>
      </main>

      {/* Subtle Footer Tagline */}
      <footer className="relative z-10 py-4 font-mono text-[10px] text-paper/40 tracking-widest uppercase">
        SOL · YOUR INTELLECTUAL HOME
      </footer>
    </div>
  );
}
