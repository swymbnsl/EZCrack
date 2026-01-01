import { useState, useEffect } from "react"
import {
  ChevronDown,
  BookOpen,
  FileText,
  Calendar,
  BarChart2,
  ChevronUp,
  ListOrdered,
  Calculator,
  Filter,
  X,
} from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type { SortOrder, YearFilter, TabType } from "@/types"

interface UnitFiltersMobileProps {
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

export function UnitFiltersMobile({
  activeTab,
  onTabChange,
  sortOrder,
  onSortOrderChange,
  yearFilter,
  onYearFilterChange,
  availableYears,
  hasFormulaSheet = false,
  onFormulaSheetClick,
}: UnitFiltersMobileProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  // Debugging for sort changes
  useEffect(() => {}, [sortOrder])

  // Helper function to handle sort order changes
  const handleSortOrderChange = (order: SortOrder) => {
    onSortOrderChange(order)
  }

  // Group buttons in a compact layout
  return (
    <div
      className="sm:hidden w-full border-b-4 overflow-hidden sticky top-0 z-20"
      style={{
        backgroundColor: isLight
          ? lightTheme.backgroundPaper
          : darkTheme.background,
        borderColor: colors.border,
      }}
    >
      {/* Controls bar with formula sheet toggle */}
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Tab buttons */}
        <div
          className="flex flex-1 border-4 p-0.5"
          style={{
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => onTabChange("topics")}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 transition-all"
            style={{
              backgroundColor:
                activeTab === "topics" ? colors.primary : "transparent",
              color:
                activeTab === "topics" ? colors.textOnPrimary : colors.text,
            }}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Topics</span>
          </button>
          <button
            onClick={() => onTabChange("questions")}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-2 transition-all"
            style={{
              backgroundColor:
                activeTab === "questions" ? colors.primary : "transparent",
              color:
                activeTab === "questions" ? colors.textOnPrimary : colors.text,
            }}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Questions</span>
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center h-10 w-10 border-4"
          style={{
            backgroundColor: showFilters
              ? colors.primary
              : colors.backgroundCard,
            color: showFilters ? colors.textOnPrimary : colors.text,
            borderColor: colors.border,
          }}
        >
          {showFilters ? (
            <X className="w-4 h-4" />
          ) : (
            <Filter className="w-4 h-4" />
          )}
        </button>

        {/* Formula sheet button */}
        {hasFormulaSheet && onFormulaSheetClick && (
          <button
            onClick={onFormulaSheetClick}
            className="flex items-center justify-center h-10 w-10 border-4"
            style={{
              backgroundColor: colors.secondary,
              color: colors.textOnPrimary,
              borderColor: colors.border,
            }}
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div
          className="px-3 pb-3 space-y-3 animate-in slide-in-from-top duration-200"
          style={{
            backgroundColor: isLight
              ? lightTheme.backgroundPaper
              : darkTheme.background,
          }}
        >
          {/* Sort topics options - always visible regardless of tab */}
          <div
            className="border-4 p-3"
            style={{
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center px-2 py-1.5 mb-2">
              <BarChart2
                className="w-4 h-4 mr-2"
                style={{ color: colors.primary }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {activeTab === "topics"
                  ? "Sort by Weightage"
                  : "Sort by Topics"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSortOrderChange("original")}
                className="py-2 px-1 flex flex-col items-center justify-center border-3"
                style={{
                  backgroundColor:
                    sortOrder === "original"
                      ? colors.primary
                      : colors.backgroundCard,
                  color:
                    sortOrder === "original"
                      ? colors.textOnPrimary
                      : colors.text,
                  borderColor:
                    sortOrder === "original"
                      ? colors.border
                      : `${colors.border}80`,
                }}
              >
                <ListOrdered className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Syllabus</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("desc")}
                className="py-2 px-1 flex flex-col items-center justify-center border-3"
                style={{
                  backgroundColor:
                    sortOrder === "desc"
                      ? colors.primary
                      : colors.backgroundCard,
                  color:
                    sortOrder === "desc" ? colors.textOnPrimary : colors.text,
                  borderColor:
                    sortOrder === "desc" ? colors.border : `${colors.border}80`,
                }}
              >
                <ChevronDown className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Highest</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("asc")}
                className="py-2 px-1 flex flex-col items-center justify-center border-3"
                style={{
                  backgroundColor:
                    sortOrder === "asc"
                      ? colors.primary
                      : colors.backgroundCard,
                  color:
                    sortOrder === "asc" ? colors.textOnPrimary : colors.text,
                  borderColor:
                    sortOrder === "asc" ? colors.border : `${colors.border}80`,
                }}
              >
                <ChevronUp className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Lowest</span>
              </button>
            </div>
          </div>

          {/* Year filter/sorting options */}
          {availableYears.length > 0 && (
            <div
              className="border-4 p-3"
              style={{
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center px-2 py-1.5 mb-2">
                <Calendar
                  className="w-4 h-4 mr-2"
                  style={{ color: colors.primary }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {activeTab === "questions"
                    ? "Filter by Year"
                    : "Filter by Year"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onYearFilterChange("all")}
                  className="py-2 px-1 flex items-center justify-center border-3"
                  style={{
                    backgroundColor:
                      yearFilter === "all"
                        ? colors.primary
                        : colors.backgroundCard,
                    color:
                      yearFilter === "all" ? colors.textOnPrimary : colors.text,
                    borderColor:
                      yearFilter === "all"
                        ? colors.border
                        : `${colors.border}80`,
                  }}
                >
                  <span className="text-xs font-medium">All</span>
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearFilterChange(year)}
                    className="py-2 px-1 flex items-center justify-center border-3"
                    style={{
                      backgroundColor:
                        yearFilter === year
                          ? colors.primary
                          : colors.backgroundCard,
                      color:
                        yearFilter === year
                          ? colors.textOnPrimary
                          : colors.text,
                      borderColor:
                        yearFilter === year
                          ? colors.border
                          : `${colors.border}80`,
                    }}
                  >
                    <span className="text-xs font-medium">{year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
