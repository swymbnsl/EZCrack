import { Calendar } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase text-gray-400 font-medium">
          Filter by Year
        </h3>
        <Calendar className="w-4 h-4 text-gray-500" />
      </div>
      <div className="bg-gray-800/30 p-1.5 rounded-xl flex flex-col gap-1.5">
        <button
          key="all-years"
          onClick={() => setYearFilter("all")}
          className={`px-4 py-2.5 rounded-lg transition-all text-left ${
            yearFilter === "all"
              ? "bg-purple-500/20 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          All Years
        </button>
        {availableYears?.map((year) => (
          <button
            key={`year-${year}`}
            onClick={() => setYearFilter(year)}
            className={`px-4 py-2.5 rounded-lg transition-all text-left ${
              yearFilter === year
                ? "bg-purple-500/20 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
