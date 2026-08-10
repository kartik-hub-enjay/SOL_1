"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  trailColor?: string;
  duration?: string;
  borderRadius?: string;
}

export default function AnimatedBorderTrail({
  children,
  className = "",
  containerClassName = "",
  trailColor = "#ee9dd6",
  duration = "3.5s",
  borderRadius = "0.75rem",
  onClick,
  ...props
}: AnimatedBorderTrailProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden p-[2px] transition-all duration-300 group cursor-pointer inline-block",
        containerClassName
      )}
      style={{ borderRadius }}
      {...props}
    >
      {/* Animated Conic Border Light Trail */}
      <div
        className="absolute inset-[-150%] animate-[spin_4s_linear_infinite]"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, ${trailColor} 360deg)`,
          animationDuration: duration,
        }}
      />

      {/* Inner Content Element */}
      <div
        className={cn(
          "relative z-10 w-full h-full bg-[#2e4ed2] text-white flex items-center justify-center font-display font-bold text-sm px-6 py-3 transition-all duration-300 group-hover:bg-[#2e4ed2]/90 shadow-lg shadow-[#2e4ed2]/20",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} - 2px)` }}
      >
        {children}
      </div>
    </div>
  );
}
