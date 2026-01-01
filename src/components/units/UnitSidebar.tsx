import { motion } from "framer-motion"
import { UnitTabs } from "./UnitTabs"
import { UnitYearFilter } from "./UnitYearFilter"
import {
  ChevronDown,
  ChevronUp,
  ListOrdered,
  BarChart2,
  Calculator,
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type { SortOrder, YearFilter, TabType } from "@/types"

interface UnitSidebarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
  yearFilter: YearFilter
  onYearFilterChange: (year: YearFilter) => void
  availableYears: number[]
  hasFormulaSheet?: boolean
  onFormulaSheetClick?: () => void
}

export function UnitSidebar({
  activeTab,
  onTabChange,
  sortOrder,
  onSortOrderChange,
  yearFilter,
  onYearFilterChange,
  availableYears,
  hasFormulaSheet = false,
  onFormulaSheetClick,
}: UnitSidebarProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full sm:w-80 sm:min-w-[320px] border-b-4 sm:border-r-4 sm:border-b-0 flex flex-col mb-4 sm:mb-0"
      style={{
        borderColor: colors.border,
        backgroundColor: colors.backgroundCard,
      }}
    >
      <div className="p-4 sm:p-8 space-y-4 sm:space-y-8 h-screen">
        {hasFormulaSheet && (
          <button
            onClick={onFormulaSheetClick}
            className="w-full flex items-center gap-3 px-4 py-3 border-4 transition-colors"
            style={{
              backgroundColor: isLight ? colors.secondary : colors.primary,
              color: colors.textOnPrimary,
              borderColor: colors.border,
            }}
          >
            <div
              className="w-8 h-8 border-2 flex items-center justify-center"
              style={{
                backgroundColor: isLight
                  ? colors.background
                  : colors.backgroundMuted,
                borderColor: colors.border,
              }}
            >
              <Calculator className="w-4 h-4" style={{ color: colors.text }} />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">View Formula Sheet</span>
              <span className="text-xs opacity-80">
                Quick formulas and notes
              </span>
            </div>
          </button>
        )}
        <UnitTabs activeTab={activeTab} setActiveTab={onTabChange} />
        <div className="space-y-2">
          <h3
            className="text-sm font-medium mb-4 flex items-center gap-2"
            style={{ color: colors.textMuted }}
          >
            <BarChart2 className="w-4 h-4" />
            {activeTab === "topics" ? "Sort Topics By" : "Sort Questions By"}
          </h3>

          <div
            className="border-4 overflow-hidden"
            style={{
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            }}
          >
            <button
              onClick={() => onSortOrderChange("original")}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b-4"
              style={{
                backgroundColor:
                  sortOrder === "original" ? colors.primary : "transparent",
                color:
                  sortOrder === "original" ? colors.textOnPrimary : colors.text,
                borderColor: colors.border,
              }}
            >
              <div
                className="w-8 h-8 border-2 flex items-center justify-center"
                style={{
                  backgroundColor:
                    sortOrder === "original"
                      ? colors.backgroundCard
                      : colors.backgroundMuted,
                  borderColor: colors.border,
                }}
              >
                <ListOrdered
                  className="w-4 h-4"
                  style={{ color: colors.text }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Syllabus Order</span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      sortOrder === "original"
                        ? "rgba(0,0,0,0.8)"
                        : colors.textMuted,
                  }}
                >
                  As defined in curriculum
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("desc")}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b-4"
              style={{
                backgroundColor:
                  sortOrder === "desc" ? colors.primary : "transparent",
                color:
                  sortOrder === "desc" ? colors.textOnPrimary : colors.text,
                borderColor: colors.border,
              }}
            >
              <div
                className="w-8 h-8 border-2 flex items-center justify-center"
                style={{
                  backgroundColor:
                    sortOrder === "desc"
                      ? colors.backgroundCard
                      : colors.backgroundMuted,
                  borderColor: colors.border,
                }}
              >
                <ChevronDown
                  className="w-4 h-4"
                  style={{ color: colors.text }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {activeTab === "topics"
                    ? "Highest Weightage"
                    : "Highest First"}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      sortOrder === "desc"
                        ? "rgba(0,0,0,0.8)"
                        : colors.textMuted,
                  }}
                >
                  {activeTab === "topics"
                    ? "Most important first"
                    : "Sort by importance"}
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("asc")}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all"
              style={{
                backgroundColor:
                  sortOrder === "asc" ? colors.primary : "transparent",
                color: sortOrder === "asc" ? colors.textOnPrimary : colors.text,
              }}
            >
              <div
                className="w-8 h-8 border-2 flex items-center justify-center"
                style={{
                  backgroundColor:
                    sortOrder === "asc"
                      ? colors.backgroundCard
                      : colors.backgroundMuted,
                  borderColor: colors.border,
                }}
              >
                <ChevronUp className="w-4 h-4" style={{ color: colors.text }} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {activeTab === "topics" ? "Lowest Weightage" : "Lowest First"}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      sortOrder === "asc"
                        ? "rgba(0,0,0,0.8)"
                        : colors.textMuted,
                  }}
                >
                  {activeTab === "topics"
                    ? "Least important first"
                    : "Sort by importance"}
                </span>
              </div>
            </button>
          </div>
        </div>
        <UnitYearFilter
          yearFilter={yearFilter}
          setYearFilter={onYearFilterChange}
          availableYears={availableYears}
        />
      </div>
    </motion.div>
  )
}
