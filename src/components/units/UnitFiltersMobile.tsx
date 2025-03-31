import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type SortOrder = "asc" | "desc" | "original";
type YearFilter = "all" | number;

interface UnitFiltersMobileProps {
  activeTab: "topics" | "questions";
  onTabChange: (tab: "topics" | "questions") => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  yearFilter: YearFilter;
  onYearFilterChange: (year: YearFilter) => void;
  availableYears: number[];
  hasFormulaSheet?: boolean;
  onFormulaSheetClick?: () => void;
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
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Debugging for sort changes
  useEffect(() => {}, [sortOrder]);

  // Helper function to handle sort order changes
  const handleSortOrderChange = (order: SortOrder) => {
    onSortOrderChange(order);
  };

  // Group buttons in a compact layout
  return (
    <div className={`sm:hidden w-full ${isLight ? "bg-white/90 backdrop-blur-sm border-b border-black/20" : "bg-gray-950/90 backdrop-blur-sm border-b border-gray-800"} overflow-hidden`}>
      {/* Controls bar with formula sheet toggle */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Tab buttons */}
        <div className={`flex flex-1 ${isLight ? "bg-gray-100 rounded-lg border border-gray-300/50" : "bg-gray-800/50 rounded-lg border border-gray-700/50"} p-0.5`}>
          <button
            onClick={() => onTabChange("topics")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md transition-all ${
              activeTab === "topics"
                ? isLight 
                  ? "bg-[#76ABAE]/40 text-black" 
                  : "bg-purple-500/20 text-white"
                : isLight
                  ? "text-gray-600" 
                  : "text-gray-400"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Topics</span>
          </button>
          <button
            onClick={() => onTabChange("questions")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-md transition-all ${
              activeTab === "questions"
                ? isLight 
                  ? "bg-[#76ABAE]/40 text-black" 
                  : "bg-purple-500/20 text-white"
                : isLight
                  ? "text-gray-600" 
                  : "text-gray-400"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Questions</span>
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center h-10 w-10 rounded-lg ${
            showFilters
              ? isLight 
                ? "bg-[#76ABAE]/40 text-black" 
                : "bg-purple-500/20 text-white"
              : isLight
                ? "bg-gray-100 text-gray-600 border border-gray-300/50" 
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
          }`}
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
            className={`flex items-center justify-center h-10 w-10 rounded-lg ${
              isLight
                ? "bg-[#FFD56B]/30 text-black border border-[#FFD56B]/50"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top duration-200">
          {/* Sort topics options - always visible regardless of tab */}
          <div className="overflow-hidden">
            <div className="flex items-center px-2 py-1.5">
              <BarChart2 className={`w-3.5 h-3.5 ${isLight ? "text-[#76ABAE]" : "text-purple-400"} mr-1.5`} />
              <span className={`text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                {activeTab === "topics"
                  ? "Sort by Weightage"
                  : "Sort by Topics"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <button
                onClick={() => handleSortOrderChange("original")}
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  sortOrder === "original"
                    ? isLight 
                      ? "bg-[#76ABAE]/40 text-black" 
                      : "bg-purple-500/20 text-white"
                    : isLight
                      ? "bg-gray-100 text-gray-700" 
                      : "bg-gray-800/30 text-gray-300"
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs">Syllabus</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("desc")}
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  sortOrder === "desc"
                    ? isLight 
                      ? "bg-[#76ABAE]/40 text-black" 
                      : "bg-purple-500/20 text-white"
                    : isLight
                      ? "bg-gray-100 text-gray-700" 
                      : "bg-gray-800/30 text-gray-300"
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs">Highest</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("asc")}
                className={`py-2 px-1 rounded-md flex flex-col items-center justify-center ${
                  sortOrder === "asc"
                    ? isLight 
                      ? "bg-[#76ABAE]/40 text-black" 
                      : "bg-purple-500/20 text-white"
                    : isLight
                      ? "bg-gray-100 text-gray-700" 
                      : "bg-gray-800/30 text-gray-300"
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs">Lowest</span>
              </button>
            </div>
          </div>

          {/* Year filter/sorting options */}
          {availableYears.length > 0 && (
            <div className="overflow-hidden">
              <div className="flex items-center px-2 py-1.5">
                <Calendar className={`w-3.5 h-3.5 ${isLight ? "text-[#76ABAE]" : "text-purple-400"} mr-1.5`} />
                <span className={`text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  {activeTab === "questions"
                    ? "Filter by Year"
                    : "Filter by Year"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 mt-1">
                <button
                  onClick={() => onYearFilterChange("all")}
                  className={`py-2 px-1 rounded-md flex items-center justify-center ${
                    yearFilter === "all"
                      ? isLight 
                        ? "bg-[#76ABAE]/40 text-black" 
                        : "bg-purple-500/20 text-white"
                      : isLight
                        ? "bg-gray-100 text-gray-700" 
                        : "bg-gray-800/30 text-gray-300"
                  }`}
                >
                  <span className="text-xs">All</span>
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearFilterChange(year)}
                    className={`py-2 px-1 rounded-md flex items-center justify-center ${
                      yearFilter === year
                        ? isLight 
                          ? "bg-[#76ABAE]/40 text-black" 
                          : "bg-purple-500/20 text-white"
                        : isLight
                          ? "bg-gray-100 text-gray-700" 
                          : "bg-gray-800/30 text-gray-300"
                    }`}
                  >
                    <span className="text-xs">{year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
