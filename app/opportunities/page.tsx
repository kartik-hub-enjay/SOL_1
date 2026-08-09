'use me';
'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { getOpportunities } from '@/lib/dataService';
import { Opportunity } from '@/lib/seedData';
import { Award, Calendar, ExternalLink, Filter, AlertCircle, Clock } from 'lucide-react';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    getOpportunities().then((data) => setOpportunities(data));
  }, []);

  const tags = ['all', 'web-dev', 'cybersecurity', 'poetry', 'design', 'debate', 'music-production', 'robotics', 'data-science'];
  const types = ['all', 'hackathon', 'workshop', 'competition', 'internship', 'meetup'];

  const filteredOpps = opportunities.filter((opp) => {
    const matchesTag = selectedTag === 'all' || opp.tag === selectedTag;
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    return matchesTag && matchesType;
  });

  return (
    <AppShell>
      <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="border-b border-paper/10 pb-6 space-y-2">
          <div className="flex items-center space-x-2 text-ember font-mono text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>UNIFIED OPPORTUNITIES FEED</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
            Hackathons, Slams & Competitions
          </h1>
          <p className="text-sm text-paper/60 font-body max-w-xl">
            Surfacing high-signal events for every interest community across India.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-ink-raised border border-paper/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tag Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-mono text-paper/40 shrink-0 flex items-center space-x-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>TAG:</span>
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-ember text-ink font-bold shadow-md shadow-ember/10'
                    : 'bg-ink text-paper/60 hover:text-paper border border-paper/10'
                }`}
              >
                {tag === 'all' ? 'All Tags' : `#${tag}`}
              </button>
            ))}
          </div>

          {/* Type Selector Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <span className="text-xs font-mono text-paper/40">TYPE:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-ink border border-paper/10 text-paper text-xs font-mono focus:outline-none focus:border-ember transition-colors"
            >
              {types.map((t) => (
                <option key={t} value={t} className="bg-ink text-paper">
                  {t === 'all' ? 'All Event Types' : t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpps.map((opp) => {
            const isPast = opp.is_expired || new Date(opp.event_date) < new Date('2026-08-01');

            return (
              <div
                key={opp.id}
                className={`p-6 rounded-2xl bg-ink-raised border flex flex-col justify-between space-y-4 transition-all ${
                  isPast
                    ? 'border-paper/5 opacity-60 bg-ink/30'
                    : 'border-paper/10 hover:border-paper/20 hover:translate-y-[-2px]'
                }`}
              >
                <div className="space-y-3">
                  {/* Badges row */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold bg-ink border border-paper/10 text-paper/70">
                      #{opp.tag}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-md font-mono text-[10px] uppercase font-bold ${
                        isPast
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-signal/10 text-signal border border-signal/30'
                      }`}
                    >
                      {isPast ? 'EXPIRED' : opp.type}
                    </span>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h2 className={`font-display font-bold text-lg leading-snug ${isPast ? 'text-paper/60 line-through' : 'text-paper'}`}>
                      {opp.title}
                    </h2>
                    <p className="text-xs font-mono text-paper/50 mt-1">{opp.org_name}</p>
                  </div>
                </div>

                {/* Footer: Date & Link */}
                <div className="pt-4 border-t border-paper/10 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-mono text-xs text-paper/60">
                    <Calendar className="w-3.5 h-3.5 text-paper/40" />
                    <span>{opp.event_date}</span>
                  </div>

                  {isPast ? (
                    <span className="font-mono text-[10px] text-red-400/80 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Registration Closed</span>
                    </span>
                  ) : (
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3.5 rounded-lg bg-ember text-ink font-mono text-xs font-bold flex items-center space-x-1 hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-ember/10"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
