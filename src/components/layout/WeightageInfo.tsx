"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import { FormulaModal } from "./FormulaModal"

export function WeightageInfo() {
  const [showFormula, setShowFormula] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <div
      className="border-4 p-3 sm:p-4 h-[88px] flex items-center"
      style={{
        backgroundColor: colors.backgroundCard,
        borderColor: colors.border,
        boxShadow: `4px 4px 0px 0px ${shadowColor}`,
      }}
    >
      <div className="flex items-center gap-2 sm:gap-4 w-full">
        <div className="relative">
          <button
            onClick={() => setShowFormula(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 border-3 flex items-center justify-center"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.border,
            }}
          >
            <Info
              className="w-5 h-5 sm:w-6 sm:h-6"
              style={{ color: colors.textOnPrimary }}
            />
          </button>

          {showFormula && (
            <FormulaModal onClose={() => setShowFormula(false)} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <h3
              className="font-bold text-sm sm:text-base truncate"
              style={{ color: colors.text }}
            >
              Weightage Calculation
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <span
              className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 border-2 truncate"
              style={{
                backgroundColor: colors.secondary,
                color: colors.textOnAccent,
                borderColor: colors.border,
              }}
            >
              Based on marks and frequency
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
