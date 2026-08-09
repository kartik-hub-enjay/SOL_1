'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import SpotlightCard from '@/components/SpotlightCard';
import { getCommunities, getJoinedCommunityIds, toggleCommunityMembership } from '@/lib/dataService';
import { Community } from '@/lib/seedData';
import { Compass, Search, Check, Users, ArrowRight } from 'lucide-react';

export default function CommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    getCommunities().then((data) => setCommunities(data));
    setJoinedIds(getJoinedCommunityIds());
  }, []);

  const handleToggleJoin = (e: React.MouseEvent, commId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleCommunityMembership(commId);
    setJoinedIds([...next]);
  };

  const tags = ['all', ...Array.from(new Set(communities.map((c) => c.tag)))];

  const filteredCommunities = communities.filter((c) => {
    const matchesTag = selectedTag === 'all' || c.tag === selectedTag;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <AppShell>
      <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-paper/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-[#2e4ed2] font-mono text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>COMMUNITY DIRECTORY</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
              Interest Communities
            </h1>
            <p className="text-sm text-paper/60 font-body mt-1">
              Join open interest spaces. Small circles quietly form inside each one.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/40" />
            <input
              type="text"
              placeholder="Search by topic or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/85 backdrop-blur-xl border border-paper/12 text-paper text-xs focus:outline-none focus:border-[#2e4ed2] transition-colors"
            />
          </div>
        </div>

        {/* Tag Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#2e4ed2] text-white font-bold border border-[#2e4ed2] shadow-md shadow-[#2e4ed2]/20'
                  : 'bg-black/85 backdrop-blur-xl text-paper/70 hover:text-paper border border-paper/12'
              }`}
            >
              {tag === 'all' ? 'All Interests' : `#${tag}`}
            </button>
          ))}
        </div>

        {/* Communities Grid with SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((comm) => {
            const isJoined = joinedIds.includes(comm.id);
            const memberCount = (comm.id.charCodeAt(5) || 7) * 4 + 18;

            return (
              <SpotlightCard
                key={comm.id}
                spotlightColor="rgba(255, 255, 255, 0.25)"
                className="group flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all cursor-pointer"
                onClick={() => router.push(`/communities/${comm.slug}`)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${comm.cover_accent}20`,
                        color: comm.cover_accent,
                        border: `1px solid ${comm.cover_accent}40`,
                      }}
                    >
                      #{comm.tag}
                    </span>

                    <div className="flex items-center space-x-1.5 text-paper/50 text-xs font-mono">
                      <Users className="w-3.5 h-3.5" />
                      <span>{memberCount}</span>
                    </div>
                  </div>

                  <h2 className="font-display font-bold text-xl text-paper group-hover:text-[#2e4ed2] transition-colors">
                    {comm.name}
                  </h2>

                  <p className="text-xs text-paper/60 font-body leading-relaxed line-clamp-3">
                    {comm.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-paper/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-paper/40 group-hover:text-paper/70 flex items-center space-x-1">
                    <span>Enter Space</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={(e) => handleToggleJoin(e, comm.id)}
                    className={`py-1.5 px-3.5 rounded-lg font-mono text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer relative z-10 ${
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
                      <span>Join</span>
                    )}
                  </button>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
