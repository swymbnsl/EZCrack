"use client"

import { useTheme } from "@/contexts/ThemeContext"
import type { ExamFilter } from "@/types"

interface ExamTypeFilterProps {
  examFilter: ExamFilter
  onExamFilterChange: (filter: ExamFilter) => void
}

export function ExamTypeFilter({
  examFilter,
  onExamFilterChange,
}: ExamTypeFilterProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const filters = [
    {
      value: "all" as ExamFilter,
      label: "All Exams",
      activeColor: isLight ? "bg-[#76ABAE]" : "bg-[#4ECDC4]",
    },
    {
      value: "midterm" as ExamFilter,
      label: "Midterm",
      shortLabel: "Mid",
      activeColor: isLight ? "bg-[#FFD56B]" : "bg-[#FFE66D]",
    },
    {
      value: "endterm" as ExamFilter,
      label: "Endterm",
      shortLabel: "End",
      activeColor: isLight ? "bg-[#FF7B54]" : "bg-[#FF6B6B]",
    },
  ]

  return (
    <div
      className={`mt-4 sm:mt-6 max-w-xl mx-auto ${
        isLight ? "bg-white border-black" : "bg-[#1E1E1E] border-white"
      } border-4 p-1.5 sm:p-2`}
    >
      <div className="flex flex-row">
        {filters.map((filter) => {
          const isActive = examFilter === filter.value

          return (
            <button
              key={filter.value}
              onClick={() => onExamFilterChange(filter.value)}
              className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                isActive
                  ? `${filter.activeColor} ${
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
                {filter.shortLabel ? (
                  <>
                    <span className="hidden sm:inline">{filter.label}</span>
                    <span className="sm:hidden">{filter.shortLabel}</span>
                  </>
                ) : (
                  filter.label
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
