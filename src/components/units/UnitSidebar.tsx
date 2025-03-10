import { motion } from "framer-motion";
import { UnitTabs } from "./UnitTabs";
import { UnitSortControls } from "./UnitSortControls";
import { UnitYearFilter } from "./UnitYearFilter";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  BarChart2,
} from "lucide-react";

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
}

export function UnitSidebar({
  activeTab,
  onTabChange,
  sortOrder,
  onSortOrderChange,
  yearFilter,
  onYearFilterChange,
  availableYears,
}: UnitSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 min-w-[320px] border-r border-gray-800 flex flex-col bg-gray-900/50"
    >
      <div className="p-8 space-y-8">
        <UnitTabs activeTab={activeTab} setActiveTab={onTabChange} />
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            Sort Topics By
          </h3>

          <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
            <button
              onClick={() => onSortOrderChange("original")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "original"
                  ? "bg-purple-500/20 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              } }0"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg ${
                  sortOrder === "original"
                    ? "bg-purple-500/20"
                    : "bg-gray-700/50"
                } flex items-center justify-center`}
              >
                <ListOrdered
                  className={`w-4 h-4 ${
                    sortOrder === "original"
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Syllabus Order</span>
                <span className="text-xs text-gray-400">
                  As defined in curriculum
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("desc")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "desc"
                  ? "bg-purple-500/20 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg ${
                  sortOrder === "desc" ? "bg-purple-500/20" : "bg-gray-700/50"
                } flex items-center justify-center`}
              >
                <ChevronDown
                  className={`w-4 h-4 ${
                    sortOrder === "desc" ? "text-purple-400" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Highest Weightage</span>
                <span className="text-xs text-gray-400">
                  Most important first
                </span>
              </div>
            </button>

            <button
              onClick={() => onSortOrderChange("asc")}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
                sortOrder === "asc"
                  ? "bg-purple-500/20 text-white"
                  : "text-gray-300 hover:bg-gray-700/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg ${
                  sortOrder === "asc" ? "bg-purple-500/20" : "bg-gray-700/50"
                } flex items-center justify-center`}
              >
                <ChevronUp
                  className={`w-4 h-4 ${
                    sortOrder === "asc" ? "text-purple-400" : "text-gray-400"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Lowest Weightage</span>
                <span className="text-xs text-gray-400">
                  Least important first
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
