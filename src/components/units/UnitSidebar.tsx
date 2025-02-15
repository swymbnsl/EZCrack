import { motion } from "framer-motion";
import { UnitTabs } from "./UnitTabs";
import { UnitSortControls } from "./UnitSortControls";
import { UnitYearFilter } from "./UnitYearFilter";

type SortOrder = "asc" | "desc";
type YearFilter = "all" | number;

interface UnitSidebarProps {
  activeTab: "topics" | "questions";
  setActiveTab: (tab: "topics" | "questions") => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  yearFilter: YearFilter;
  setYearFilter: (year: YearFilter) => void;
  availableYears: number[];
}

export function UnitSidebar({
  activeTab,
  setActiveTab,
  sortOrder,
  setSortOrder,
  yearFilter,
  setYearFilter,
  availableYears,
}: UnitSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 min-w-[320px] border-r border-gray-800 flex flex-col bg-gray-900/50"
    >
      <div className="p-8 space-y-8">
        <UnitTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <UnitSortControls sortOrder={sortOrder} setSortOrder={setSortOrder} />
        <UnitYearFilter
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          availableYears={availableYears}
        />
      </div>
    </motion.div>
  );
}
