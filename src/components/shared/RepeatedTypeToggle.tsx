"use client"

import { useTheme } from "@/contexts/ThemeContext"
import type { RepeatedType } from "@/types"

interface RepeatedTypeToggleProps {
  repeatedType: RepeatedType
  onRepeatedTypeChange: (type: RepeatedType) => void
}

export function RepeatedTypeToggle({
  repeatedType,
  onRepeatedTypeChange,
}: RepeatedTypeToggleProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const types = [
    {
      value: "concept" as RepeatedType,
      label: "Concept Based",
      activeColor: isLight ? "bg-[#76ABAE]" : "bg-[#4ECDC4]",
    },
    {
      value: "pattern" as RepeatedType,
      label: "Pattern Based",
      activeColor: isLight ? "bg-[#FFD56B]" : "bg-[#FFE66D]",
    },
  ]

  return (
    <div
      className={`mt-4 sm:mt-6 max-w-xl mx-auto ${
        isLight ? "bg-white border-black" : "bg-[#1E1E1E] border-white"
      } border-4 p-1.5 sm:p-2`}
    >
      <div className="flex flex-row">
        {types.map((type) => {
          const isActive = repeatedType === type.value

          return (
            <button
              key={type.value}
              onClick={() => onRepeatedTypeChange(type.value)}
              className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                isActive
                  ? `${type.activeColor} ${
                      isLight
                        ? "text-black border-black"
                        : "text-[#121212] border-white"
                    }`
                  : isLight
                  ? "bg-white text-black border-black"
                  : "bg-[#1E1E1E] text-white border-white"
              }`}
            >
              <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                {type.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
