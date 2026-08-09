'use me';
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SEEDED_COMMUNITIES, SEEDED_UNIVERSITIES } from '@/lib/seedData';
import { Shield, Users, Layers, Activity, Lock, ArrowLeft, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Aggregate Data only (Zero student names / emails / messages)
  const chartData = SEEDED_COMMUNITIES.map((c) => ({
    name: c.name.split(' ')[0],
    tag: c.tag,
    students: (c.id.charCodeAt(5) || 7) * 5 + 24,
    color: c.cover_accent,
  }));

  const totalActiveStudents = chartData.reduce((acc, item) => acc + item.students, 0);
  const circleHealthScore = 94.2;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-ink text-paper p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-paper/10 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 font-mono text-xs text-violet-mist uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>UNIVERSITY PARTNER DASHBOARD · AGGREGATE VIEW</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper tracking-tight">
              Institutional Talent & Interest Analytics
            </h1>
            <p className="text-sm text-paper/60 font-body">
              Macro insights into student curiosity trends across partnered engineering & arts faculties.
            </p>
          </div>

          <Link
            href="/communities"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-ink-raised border border-paper/10 text-paper text-xs font-mono hover:bg-paper/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student App</span>
          </Link>
        </div>

        {/* Privacy Mandate Alert Banner */}
        <div className="p-4 rounded-2xl bg-violet-mist/10 border border-violet-mist/30 flex items-center space-x-3 text-violet-mist text-xs font-mono">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            <strong>Zero-PII Privacy Enforced:</strong> Individual student names, emails, exam marks, and circle messages are strictly excluded from institutional partner APIs.
          </span>
        </div>

        {/* Top Aggregate Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 space-y-2">
            <div className="flex items-center justify-between text-paper/50 font-mono text-xs">
              <span>TOTAL ACTIVE STUDENTS</span>
              <Users className="w-4 h-4 text-signal" />
            </div>
            <div className="font-display font-bold text-4xl text-paper">{totalActiveStudents}</div>
            <div className="text-[10px] font-mono text-signal flex items-center space-x-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+14% vs last week</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 space-y-2">
            <div className="flex items-center justify-between text-paper/50 font-mono text-xs">
              <span>PARTNER UNIVERSITIES</span>
              <Layers className="w-4 h-4 text-ember" />
            </div>
            <div className="font-display font-bold text-4xl text-paper">{SEEDED_UNIVERSITIES.length}</div>
            <div className="text-[10px] font-mono text-paper/40">Verified domain matching</div>
          </div>

          <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 space-y-2">
            <div className="flex items-center justify-between text-paper/50 font-mono text-xs">
              <span>CIRCLE HEALTH METRIC</span>
              <Activity className="w-4 h-4 text-violet-mist" />
            </div>
            <div className="font-display font-bold text-4xl text-paper">{circleHealthScore}%</div>
            <div className="text-[10px] font-mono text-violet-mist">Active weekly engagement rate</div>
          </div>
        </div>

        {/* Recharts Bar Chart Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ink-raised border border-paper/10 space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-paper">Student Distribution by Interest Tag</h2>
            <p className="text-xs text-paper/60 font-body">
              Aggregate student count per interest community across all partner campuses.
            </p>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#F6F4FF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(246, 244, 255, 0.1)' }}
                />
                <YAxis
                  stroke="#F6F4FF"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(246, 244, 255, 0.1)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181A38',
                    borderColor: 'rgba(246, 244, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#F6F4FF',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                  cursor={{ fill: 'rgba(246, 244, 255, 0.05)' }}
                />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Communities Ranking List (Aggregate Only) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ink-raised border border-paper/10 space-y-4">
          <h2 className="font-display font-bold text-xl text-paper">Communities by Student Volume</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartData.map((item, idx) => (
              <div
                key={item.tag}
                className="p-4 rounded-xl bg-ink border border-paper/10 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-paper/40">#{idx + 1}</span>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-display font-bold text-sm text-paper">{item.name}</span>
                </div>

                <div className="font-mono text-xs font-bold text-signal">
                  {item.students} Students
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
