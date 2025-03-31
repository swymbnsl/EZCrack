import { motion } from "framer-motion";
import { UnitTabs } from "./UnitTabs";
import { UnitYearFilter } from "./UnitYearFilter";
import {
  ChevronDown,
  ChevronUp,
  ListOrdered,
  BarChart2,
  Calculator,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type SortOrder = "asc" | "desc" | "original";
type YearFilter = "all" | number;

interface UnitSidebarProps {
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
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`w-full sm:w-80 sm:min-w-[320px] border-b-4 sm:border-r-4 sm:border-b-0 ${
        isLight 
          ? "border-black bg-white" 
          : "border-white bg-[#1E1E1E]"
      } flex flex-col mb-4 sm:mb-0`}
    >
      <div className="p-4 sm:p-8 space-y-4 sm:space-y-8 h-screen">
        {hasFormulaSheet && (
          <button
            onClick={onFormulaSheetClick}
            className={`w-full flex items-center gap-3 px-4 py-3 ${
              isLight 
                ? "bg-[#FFD56B] text-black border-black" 
                : "bg-[#4ECDC4] text-[#121212] border-white"
            } border-4 transition-colors`}
          >
            <div className={`w-8 h-8 ${
              isLight 
                ? "bg-white border-black" 
                : "bg-[#252525] border-white"
            } border-2 flex items-center justify-center`}>
              <Calculator className={`w-4 h-4 ${isLight ? "text-black" : "text-white"}`} />
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
          <h3 className={`text-sm font-medium ${
            isLight ? "text-gray-600" : "text-gray-400"
          } mb-4 flex items-center gap-2`}>
            <BarChart2 className="w-4 h-4" />
            {activeTab === "topics" ? "Sort Topics By" : "Sort Questions By"}
          </h3>

          <div className={`${
            isLight 
              ? "bg-white border-black" 
              : "bg-[#1E1E1E] border-white"
          } border-4 overflow-hidden`}>
            <button
              onClick={() => onSortOrderChange("original")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "original"
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
                  sortOrder === "original"
                    ? isLight 
                      ? "bg-white border-black" 
                      : "bg-[#1E1E1E] border-white"
                    : isLight 
                      ? "bg-[#F5F5F5] border-black" 
                      : "bg-[#252525] border-white"
                } border-2 flex items-center justify-center`}
              >
                <ListOrdered
                  className={`w-4 h-4 ${
                    isLight ? "text-black" : "text-white"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Syllabus Order</span>
                <span className={`text-xs ${
                  sortOrder === "original"
                    ? isLight 
                      ? "text-black opacity-80" 
                      : "text-black opacity-80"
                    : isLight 
                      ? "text-gray-600" 
                      : "text-gray-400"
                }`}>
                  As defined in curriculum
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("desc")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "desc"
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
                  sortOrder === "desc"
                    ? isLight 
                      ? "bg-white border-black" 
                      : "bg-[#1E1E1E] border-white"
                    : isLight 
                      ? "bg-[#F5F5F5] border-black" 
                      : "bg-[#252525] border-white"
                } border-2 flex items-center justify-center`}
              >
                <ChevronDown
                  className={`w-4 h-4 ${
                    isLight ? "text-black" : "text-white"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {activeTab === "topics"
                    ? "Highest Weightage"
                    : "Highest First"}
                </span>
                <span className={`text-xs ${
                  sortOrder === "desc"
                    ? isLight 
                      ? "text-black opacity-80" 
                      : "text-black opacity-80"
                    : isLight 
                      ? "text-gray-600" 
                      : "text-gray-400"
                }`}>
                  {activeTab === "topics"
                    ? "Most important first"
                    : "Sort by importance"}
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("asc")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "asc"
                  ? isLight 
                    ? "bg-[#76ABAE] text-black" 
                    : "bg-[#4ECDC4] text-[#121212]"
                  : isLight
                    ? "text-black" 
                    : "text-white"
              }`}
            >
              <div
                className={`w-8 h-8 ${
                  sortOrder === "asc"
                    ? isLight 
                      ? "bg-white border-black" 
                      : "bg-[#1E1E1E] border-white"
                    : isLight 
                      ? "bg-[#F5F5F5] border-black" 
                      : "bg-[#252525] border-white"
                } border-2 flex items-center justify-center`}
              >
                <ChevronUp
                  className={`w-4 h-4 ${
                    isLight ? "text-black" : "text-white"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {activeTab === "topics" ? "Lowest Weightage" : "Lowest First"}
                </span>
                <span className={`text-xs ${
                  sortOrder === "asc"
                    ? isLight 
                      ? "text-black opacity-80" 
                      : "text-black opacity-80"
                    : isLight 
                      ? "text-gray-600" 
                      : "text-gray-400"
                }`}>
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
  );
}
