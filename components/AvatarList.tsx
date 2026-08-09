"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface AvatarListItem {
  id: string
  name: string
  tag: string
  icon: React.ComponentType<{ className?: string }>
  active?: boolean
}

export interface AvatarListProps {
  items: AvatarListItem[]
  onSelect?: (item: AvatarListItem) => void
  className?: string
}

export default function AvatarList({ items, onSelect, className }: AvatarListProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("flex items-center -space-x-2.5 overflow-visible p-1", className)}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = item.active

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 cursor-pointer group",
                    "hover:scale-115 hover:z-30 hover:shadow-lg hover:shadow-[#2e4ed2]/30",
                    isActive
                      ? "bg-[#2e4ed2] text-white border-white z-20 scale-105 shadow-md shadow-[#2e4ed2]/40"
                      : "bg-black/90 text-paper/70 border-paper/20 hover:border-[#2e4ed2] hover:bg-black"
                  )}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  {isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs bg-black text-white border-paper/20">
                {item.name} ({`#${item.tag}`})
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
