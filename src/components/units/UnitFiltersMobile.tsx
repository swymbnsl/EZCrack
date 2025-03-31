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
    <div className={`sm:hidden w-full ${isLight ? "bg-[#FFFFFA] border-b-4 border-black" : "bg-[#121212] border-b-4 border-white"} overflow-hidden sticky top-0 z-20`}>
      {/* Controls bar with formula sheet toggle */}
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Tab buttons */}
        <div className={`flex flex-1 ${isLight ? "bg-white border-4 border-black" : "bg-[#1E1E1E] border-4 border-white"} p-0.5`}>
          <button
            onClick={() => onTabChange("topics")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 transition-all ${
              activeTab === "topics"
                ? isLight 
                  ? "bg-[#76ABAE] text-black" 
                  : "bg-[#4ECDC4] text-[#121212]"
                : isLight
                  ? "text-black" 
                  : "text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Topics</span>
          </button>
          <button
            onClick={() => onTabChange("questions")}
            className={`flex-1 flex items-center justify-center gap-1 py-2 px-2 transition-all ${
              activeTab === "questions"
                ? isLight 
                  ? "bg-[#76ABAE] text-black" 
                  : "bg-[#4ECDC4] text-[#121212]"
                : isLight
                  ? "text-black" 
                  : "text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Questions</span>
          </button>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center h-10 w-10 ${
            showFilters
              ? isLight 
                ? "bg-[#76ABAE] text-black border-4 border-black" 
                : "bg-[#4ECDC4] text-[#121212] border-4 border-white"
              : isLight
                ? "bg-white text-black border-4 border-black" 
                : "bg-[#1E1E1E] text-white border-4 border-white"
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
            className={`flex items-center justify-center h-10 w-10 ${
              isLight
                ? "bg-[#FFD56B] text-black border-4 border-black"
                : "bg-[#FFE66D] text-[#121212] border-4 border-white"
            }`}
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className={`px-3 pb-3 space-y-3 animate-in slide-in-from-top duration-200 ${isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"}`}>
          {/* Sort topics options - always visible regardless of tab */}
          <div className={`${isLight ? "bg-white border-4 border-black" : "bg-[#1E1E1E] border-4 border-white"} p-3`}>
            <div className="flex items-center px-2 py-1.5 mb-2">
              <BarChart2 className={`w-4 h-4 ${isLight ? "text-[#76ABAE]" : "text-[#4ECDC4]"} mr-2`} />
              <span className={`text-sm font-medium ${isLight ? "text-black" : "text-white"}`}>
                {activeTab === "topics"
                  ? "Sort by Weightage"
                  : "Sort by Topics"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSortOrderChange("original")}
                className={`py-2 px-1 flex flex-col items-center justify-center ${
                  sortOrder === "original"
                    ? isLight 
                      ? "bg-[#76ABAE] text-black border-3 border-black" 
                      : "bg-[#4ECDC4] text-[#121212] border-3 border-white"
                    : isLight
                      ? "bg-white text-black border-3 border-black/50" 
                      : "bg-[#1E1E1E] text-white border-3 border-white/50"
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Syllabus</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("desc")}
                className={`py-2 px-1 flex flex-col items-center justify-center ${
                  sortOrder === "desc"
                    ? isLight 
                      ? "bg-[#76ABAE] text-black border-3 border-black" 
                      : "bg-[#4ECDC4] text-[#121212] border-3 border-white"
                    : isLight
                      ? "bg-white text-black border-3 border-black/50" 
                      : "bg-[#1E1E1E] text-white border-3 border-white/50"
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Highest</span>
              </button>
              <button
                onClick={() => handleSortOrderChange("asc")}
                className={`py-2 px-1 flex flex-col items-center justify-center ${
                  sortOrder === "asc"
                    ? isLight 
                      ? "bg-[#76ABAE] text-black border-3 border-black" 
                      : "bg-[#4ECDC4] text-[#121212] border-3 border-white"
                    : isLight
                      ? "bg-white text-black border-3 border-black/50" 
                      : "bg-[#1E1E1E] text-white border-3 border-white/50"
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5 mb-0.5" />
                <span className="text-xs font-medium">Lowest</span>
              </button>
            </div>
          </div>

          {/* Year filter/sorting options */}
          {availableYears.length > 0 && (
            <div className={`${isLight ? "bg-white border-4 border-black" : "bg-[#1E1E1E] border-4 border-white"} p-3`}>
              <div className="flex items-center px-2 py-1.5 mb-2">
                <Calendar className={`w-4 h-4 ${isLight ? "text-[#76ABAE]" : "text-[#4ECDC4]"} mr-2`} />
                <span className={`text-sm font-medium ${isLight ? "text-black" : "text-white"}`}>
                  {activeTab === "questions"
                    ? "Filter by Year"
                    : "Filter by Year"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onYearFilterChange("all")}
                  className={`py-2 px-1 flex items-center justify-center ${
                    yearFilter === "all"
                      ? isLight 
                        ? "bg-[#76ABAE] text-black border-3 border-black" 
                        : "bg-[#4ECDC4] text-[#121212] border-3 border-white"
                      : isLight
                        ? "bg-white text-black border-3 border-black/50" 
                        : "bg-[#1E1E1E] text-white border-3 border-white/50"
                  }`}
                >
                  <span className="text-xs font-medium">All</span>
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => onYearFilterChange(year)}
                    className={`py-2 px-1 flex items-center justify-center ${
                      yearFilter === year
                        ? isLight 
                          ? "bg-[#76ABAE] text-black border-3 border-black" 
                          : "bg-[#4ECDC4] text-[#121212] border-3 border-white"
                        : isLight
                          ? "bg-white text-black border-3 border-black/50" 
                          : "bg-[#1E1E1E] text-white border-3 border-white/50"
                    }`}
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
  );
}
