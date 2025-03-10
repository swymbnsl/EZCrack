import { Calendar, CalendarDays } from "lucide-react";

type YearFilter = "all" | number;

interface UnitYearFilterProps {
  yearFilter: YearFilter;
  setYearFilter: (year: YearFilter) => void;
  availableYears: number[];
}

export function UnitYearFilter({
  yearFilter,
  setYearFilter,
  availableYears,
}: UnitYearFilterProps) {
  if (!availableYears || availableYears.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        Filter by Year
      </h3>

      <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setYearFilter("all")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            yearFilter === "all"
              ? "bg-purple-500/20 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          } `}
        >
          <div
            className={`w-8 h-8 rounded-lg ${
              yearFilter === "all" ? "bg-purple-500/20" : "bg-gray-700/50"
            } flex items-center justify-center`}
          >
            <Calendar
              className={`w-4 h-4 ${
                yearFilter === "all" ? "text-purple-400" : "text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">All Years</span>
            <span className="text-xs text-gray-400">
              {availableYears.length} years of questions
            </span>
          </div>
        </button>

        {availableYears.map((year, index) => (
          <button
            key={year}
            onClick={() => setYearFilter(year)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
              yearFilter === year
                ? "bg-purple-500/20 text-white"
                : "text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg ${
                yearFilter === year ? "bg-purple-500/20" : "bg-gray-700/50"
              } flex items-center justify-center`}
            >
              <span
                className={`text-sm font-medium ${
                  yearFilter === year ? "text-purple-400" : "text-gray-400"
                }`}
              >
                {year}
              </span>
            </div>
            <span className="font-medium">{year} Questions</span>
          </button>
        ))}
      </div>
    </div>
  );
}
