"use client"

import { SortAsc, SortDesc } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type { SortOrder } from "@/types"

// This component uses a subset of SortOrder without "original"
type BinarySortOrder = "asc" | "desc"

interface UnitSortControlsProps {
  sortOrder: BinarySortOrder
  setSortOrder: (order: BinarySortOrder) => void
}

export function UnitSortControls({
  sortOrder,
  setSortOrder,
}: UnitSortControlsProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-sm uppercase font-medium"
          style={{ color: colors.textMuted }}
        >
          Sort By Weightage
        </h3>
        {sortOrder === "asc" ? (
          <SortAsc className="w-4 h-4" style={{ color: colors.textMuted }} />
        ) : (
          <SortDesc className="w-4 h-4" style={{ color: colors.textMuted }} />
        )}
      </div>
      <div
        className="p-1.5 rounded-xl flex gap-1.5"
        style={{ backgroundColor: colors.backgroundMuted }}
      >
        <button
          onClick={() => setSortOrder("asc")}
          className="flex-1 px-4 py-2.5 rounded-lg transition-all text-center"
          style={{
            backgroundColor:
              sortOrder === "asc" ? colors.secondary : "transparent",
            color: sortOrder === "asc" ? colors.textOnAccent : colors.textMuted,
          }}
          onMouseEnter={(e) => {
            if (sortOrder !== "asc") {
              e.currentTarget.style.backgroundColor = isLight
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
              e.currentTarget.style.color = colors.text
            }
          }}
          onMouseLeave={(e) => {
            if (sortOrder !== "asc") {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = colors.textMuted
            }
          }}
        >
          Ascending
        </button>
        <button
          onClick={() => setSortOrder("desc")}
          className="flex-1 px-4 py-2.5 rounded-lg transition-all text-center"
          style={{
            backgroundColor:
              sortOrder === "desc" ? colors.secondary : "transparent",
            color:
              sortOrder === "desc" ? colors.textOnAccent : colors.textMuted,
          }}
          onMouseEnter={(e) => {
            if (sortOrder !== "desc") {
              e.currentTarget.style.backgroundColor = isLight
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.05)"
              e.currentTarget.style.color = colors.text
            }
          }}
          onMouseLeave={(e) => {
            if (sortOrder !== "desc") {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = colors.textMuted
            }
          }}
        >
          Descending
        </button>
      </div>
    </div>
  )
}
