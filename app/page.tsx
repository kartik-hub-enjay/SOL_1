export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-8 text-center">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-paper/10 bg-ink-raised mb-6">
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse"></span>
        <span className="font-mono text-xs text-signal uppercase tracking-wider">Phase 0 — Setup Complete</span>
      </div>
      <h1 className="font-display font-bold text-4xl sm:text-6xl text-paper mb-4 tracking-tight">
        Spark <span className="text-ember">MVP</span>
      </h1>
      <p className="text-paper/70 max-w-md text-base sm:text-lg mb-8 font-body">
        Find your actual crowd. Build real things. Reach the National Guild.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="px-4 py-2 rounded-lg bg-ink-raised border border-paper/10 font-mono text-xs text-violet-mist">
          SUPABASE_CONNECTED
        </div>
        <div className="px-4 py-2 rounded-lg bg-ember text-ink font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer">
          Get Started
        </div>
      </div>
    </main>
  );
}
