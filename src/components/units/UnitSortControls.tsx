import { SortAsc, SortDesc } from "lucide-react";

type SortOrder = "asc" | "desc";

interface UnitSortControlsProps {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export function UnitSortControls({
  sortOrder,
  setSortOrder,
}: UnitSortControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase text-gray-400 font-medium">
          Sort By Weightage
        </h3>
        {sortOrder === "asc" ? (
          <SortAsc className="w-4 h-4 text-gray-500" />
        ) : (
          <SortDesc className="w-4 h-4 text-gray-500" />
        )}
      </div>
      <div className="bg-gray-800/30 p-1.5 rounded-xl flex gap-1.5">
        <button
          onClick={() => setSortOrder("asc")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all text-center ${
            sortOrder === "asc"
              ? "bg-purple-500/20 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          Ascending
        </button>
        <button
          onClick={() => setSortOrder("desc")}
          className={`flex-1 px-4 py-2.5 rounded-lg transition-all text-center ${
            sortOrder === "desc"
              ? "bg-purple-500/20 text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          Descending
        </button>
      </div>
    </div>
  );
}
