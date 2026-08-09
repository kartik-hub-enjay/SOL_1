"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"

export interface DockItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  href?: string
  active?: boolean
}

export interface DockProps {
  className?: string
  orientation?: "horizontal" | "vertical"
  tooltipSide?: "top" | "bottom" | "left" | "right"
  activeLabel?: string | null
  items: DockItem[]
}

export default function Dock({
  items,
  className,
  orientation = "horizontal",
  tooltipSide,
  activeLabel,
}: DockProps) {
  const [internalActive, setInternalActive] = React.useState<string | null>(null)
  const [hovered, setHovered] = React.useState<number | null>(null)

  const isVertical = orientation === "vertical"
  const defaultTooltipSide = tooltipSide ?? (isVertical ? "right" : "top")

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        isVertical ? "h-full w-auto py-4" : "w-full py-12",
        className
      )}
    >
      <motion.div
        animate={isVertical ? { x: [0, -2, 0] } : { y: [0, -2, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "flex items-center rounded-3xl border bg-background/70 backdrop-blur-2xl shadow-lg",
          isVertical
            ? "flex-col gap-4 px-3 py-4"
            : "flex-row items-end gap-4 px-4 py-3"
        )}
        style={{
          transform: isVertical
            ? "perspective(600px) rotateY(-5deg)"
            : "perspective(600px) rotateX(10deg)",
        }}
      >
        <TooltipProvider delayDuration={100}>
          {items.map((item, i) => {
            const isActive =
              item.active !== undefined
                ? item.active
                : activeLabel !== undefined
                ? activeLabel === item.label
                : internalActive === item.label
            const isHovered = hovered === i

            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <motion.div
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? (isVertical ? 5 : -5) : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative flex flex-col items-center"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-2xl relative transition-all duration-200",
                        isHovered && "bg-black shadow-[0_0_18px_#ee9dd6] border border-[#ee9dd6]",
                        isActive && !isHovered && "bg-black shadow-sm border border-paper/20"
                      )}
                      onClick={() => {
                        setInternalActive(item.label)
                        item.onClick?.()
                      }}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 transition-colors",
                          (isActive || isHovered) ? "text-white" : "text-paper/70"
                        )}
                      />
                      {/* Glowing ring effect */}
                      {isHovered && (
                        <motion.span
                          layoutId="glow"
                          className="absolute inset-0 rounded-2xl border border-[#ee9dd6]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Button>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="dot"
                        className="w-1.5 h-1.5 rounded-full bg-[#ee9dd6] mt-1"
                      />
                    )}
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side={defaultTooltipSide} className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </motion.div>
    </div>
  )
}
