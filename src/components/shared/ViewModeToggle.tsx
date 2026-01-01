"use client"

import { BookOpen, Calendar, Repeat } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import type { ViewMode } from "@/types"

interface ViewModeToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const modes = [
    {
      value: "units" as ViewMode,
      label: "Unit-wise",
      icon: BookOpen,
      activeColor: isLight ? "bg-[#76ABAE]" : "bg-[#4ECDC4]",
    },
    {
      value: "yearwise" as ViewMode,
      label: "Year-wise",
      icon: Calendar,
      activeColor: isLight ? "bg-[#FFD56B]" : "bg-[#FFE66D]",
    },
    {
      value: "repeated" as ViewMode,
      label: "Repeated",
      icon: Repeat,
      activeColor: isLight ? "bg-[#FF7B54]" : "bg-[#FF6B6B]",
    },
  ]

  return (
    <div
      className={`max-w-xl mx-auto ${
        isLight ? "bg-white border-black" : "bg-[#1E1E1E] border-white"
      } border-4 p-1.5 sm:p-2`}
    >
      <div className="flex flex-row">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = viewMode === mode.value

          return (
            <button
              key={mode.value}
              onClick={() => onViewModeChange(mode.value)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                isActive
                  ? `${mode.activeColor} ${
                      isLight
                        ? "text-black border-black"
                        : "text-[#121212] border-white"
                    }`
                  : isLight
                  ? "bg-white text-black border-black"
                  : "bg-[#1E1E1E] text-white border-white"
              }`}
            >
              <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                {mode.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
