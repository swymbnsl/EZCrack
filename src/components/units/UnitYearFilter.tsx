import { Calendar, CalendarDays } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type { YearFilter } from "@/types"

interface UnitYearFilterProps {
  yearFilter: YearFilter
  setYearFilter: (year: YearFilter) => void
  availableYears: number[]
}

export function UnitYearFilter({
  yearFilter,
  setYearFilter,
  availableYears,
}: UnitYearFilterProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  if (!availableYears || availableYears.length === 0) return null

  return (
    <div className="space-y-2">
      <h3
        className="text-sm font-medium mb-4 flex items-center gap-2"
        style={{ color: colors.textMuted }}
      >
        <CalendarDays className="w-4 h-4" />
        Filter by Year
      </h3>

      <div
        className="border-4 overflow-hidden"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        }}
      >
        <button
          onClick={() => setYearFilter("all")}
          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b-4"
          style={{
            backgroundColor:
              yearFilter === "all" ? colors.primary : "transparent",
            color: yearFilter === "all" ? colors.textOnPrimary : colors.text,
            borderColor: colors.border,
          }}
        >
          <div
            className="w-8 h-8 border-2 flex items-center justify-center"
            style={{
              backgroundColor:
                yearFilter === "all"
                  ? colors.backgroundCard
                  : colors.backgroundMuted,
              borderColor: colors.border,
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: colors.text }} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">All Years</span>
            <span
              className="text-xs"
              style={{
                color:
                  yearFilter === "all" ? "rgba(0,0,0,0.8)" : colors.textMuted,
              }}
            >
              {availableYears.length} years of questions
            </span>
          </div>
        </button>

        {availableYears.map((year, index) => (
          <button
            key={year}
            onClick={() => setYearFilter(year)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
              index !== availableYears.length - 1 ? "border-b-4" : ""
            }`}
            style={{
              backgroundColor:
                yearFilter === year ? colors.primary : "transparent",
              color: yearFilter === year ? colors.textOnPrimary : colors.text,
              borderColor: colors.border,
            }}
          >
            <div
              className="w-8 h-8 border-2 flex items-center justify-center"
              style={{
                backgroundColor:
                  yearFilter === year
                    ? colors.backgroundCard
                    : colors.backgroundMuted,
                borderColor: colors.border,
              }}
            >
              <span
                className="text-[0.65rem] font-medium"
                style={{ color: colors.text }}
              >
                {year}
              </span>
            </div>
            <span className="font-medium">{year} Questions</span>
          </button>
        ))}
      </div>
    </div>
  )
}
