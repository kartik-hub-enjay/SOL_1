'use me';
'use client';

import React, { useMemo } from 'react';

export interface ConstellationSeed {
  seed: number;
  depth_first: number;
  overt_social: number;
  truth_seeking: number;
  primary_interest?: string;
}

interface ConstellationSVGProps {
  seedData?: ConstellationSeed;
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
  seal?: boolean; // small seal view for chat header
}

export default function ConstellationSVG({
  seedData = { seed: 42, depth_first: 0.7, overt_social: 0.6, truth_seeking: 0.8 },
  width = 300,
  height = 300,
  className = '',
  animate = false,
  seal = false,
}: ConstellationSVGProps) {
  const { nodes, lines } = useMemo(() => {
    const seedVal = seedData.seed || 42;
    const count = seal ? 6 : 9;
    const computedNodes = [];

    // Deterministic pseudo-random number generator
    const pseudoRandom = (index: number) => {
      const x = Math.sin(seedVal * 9999 + index * 1337) * 10000;
      return x - Math.floor(x);
    };

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * (seal ? 0.38 : 0.36);

    const colors = ['#FF7A45', '#7CF5D6', '#8C87F2'];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + pseudoRandom(i) * 0.5;
      const r = (0.25 + pseudoRandom(i + 10) * 0.65) * maxRadius;

      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      const radius = seal ? 2.5 + pseudoRandom(i + 20) * 2 : 4 + pseudoRandom(i + 20) * 5;
      const color = colors[i % colors.length];

      computedNodes.push({ id: i, x, y, r: radius, color });
    }

    const computedLines = [];
    for (let i = 0; i < computedNodes.length; i++) {
      for (let j = i + 1; j < computedNodes.length; j++) {
        const dx = computedNodes[i].x - computedNodes[j].x;
        const dy = computedNodes[i].y - computedNodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxRadius * (seal ? 1.2 : 1.1)) {
          const opacity = Math.max(0.15, 0.6 - dist / (maxRadius * 1.5));
          computedLines.push({
            x1: computedNodes[i].x,
            y1: computedNodes[i].y,
            x2: computedNodes[j].x,
            y2: computedNodes[j].y,
            opacity,
          });
        }
      }
    }

    return { nodes: computedNodes, lines: computedLines };
  }, [seedData, width, height, seal]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`${className} ${animate ? 'animate-pulse' : ''}`}
      aria-label="Fingerprint Constellation Seal"
    >
      <defs>
        <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CF5D6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0F1024" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central subtle energy halo */}
      <circle cx={width / 2} cy={height / 2} r={width * 0.4} fill="url(#sparkGlow)" />

      {/* Connecting constellation lines */}
      {lines.map((line, idx) => (
        <line
          key={`line-${idx}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#F6F4FF"
          strokeWidth={seal ? 1 : 1.5}
          strokeOpacity={line.opacity}
          strokeDasharray={idx % 3 === 0 ? '3 3' : 'none'}
        />
      ))}

      {/* Star Nodes */}
      {nodes.map((node) => (
        <g key={`node-${node.id}`}>
          {/* Subtle outer glow for ember nodes */}
          {node.color === '#FF7A45' && (
            <circle cx={node.x} cy={node.y} r={node.r * 1.8} fill="#FF7A45" opacity="0.25" />
          )}
          <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
        </g>
      ))}
    </svg>
  );
}
