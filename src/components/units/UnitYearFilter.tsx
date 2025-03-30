import { Calendar, CalendarDays } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!availableYears || availableYears.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className={`text-sm font-medium ${
        isLight ? "text-gray-600" : "text-gray-400"
      } mb-4 flex items-center gap-2`}>
        <CalendarDays className="w-4 h-4" />
        Filter by Year
      </h3>

      <div className={`${
        isLight 
          ? "bg-white border-black" 
          : "bg-[#1E1E1E] border-white"
      } border-4 overflow-hidden`}>
        <button
          onClick={() => setYearFilter("all")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            yearFilter === "all"
              ? isLight 
                ? "bg-[#76ABAE] text-black" 
                : "bg-[#4ECDC4] text-[#121212]"
              : isLight
                ? "text-black" 
                : "text-white"
          } ${isLight ? "border-black" : "border-white"} border-b-4`}
        >
          <div
            className={`w-8 h-8 ${
              yearFilter === "all"
                ? isLight 
                  ? "bg-white border-black" 
                  : "bg-[#1E1E1E] border-white"
                : isLight 
                  ? "bg-[#F5F5F5] border-black" 
                  : "bg-[#252525] border-white"
            } border-2 flex items-center justify-center`}
          >
            <Calendar
              className={`w-4 h-4 ${
                isLight ? "text-black" : "text-white"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">All Years</span>
            <span className={`text-xs ${
              yearFilter === "all"
                ? isLight 
                  ? "text-black opacity-80" 
                  : "text-black opacity-90"
                : isLight 
                  ? "text-gray-600" 
                  : "text-gray-400"
            }`}>
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
                ? isLight 
                  ? "bg-[#76ABAE] text-black" 
                  : "bg-[#4ECDC4] text-[#121212]"
                : isLight
                  ? "text-black" 
                  : "text-white"
            } ${index !== availableYears.length - 1 ? (isLight ? "border-black" : "border-white") + " border-b-4" : ""}`}
          >
            <div
              className={`w-8 h-8 ${
                yearFilter === year
                  ? isLight 
                    ? "bg-white border-black" 
                    : "bg-[#1E1E1E] border-white"
                  : isLight 
                    ? "bg-[#F5F5F5] border-black" 
                    : "bg-[#252525] border-white"
              } border-2 flex items-center justify-center`}
            >
              <span
                className={`text-sm font-medium ${
                  isLight ? "text-black" : "text-white"
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
