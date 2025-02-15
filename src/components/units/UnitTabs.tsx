import { BookOpen, Filter } from "lucide-react";

interface UnitTabsProps {
  activeTab: "topics" | "questions";
  setActiveTab: (tab: "topics" | "questions") => void;
}

export function UnitTabs({ activeTab, setActiveTab }: UnitTabsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase text-gray-400 font-medium">View</h3>
        <Filter className="w-4 h-4 text-gray-500" />
      </div>
      <div className="bg-gray-800/30 p-1.5 rounded-xl flex flex-col gap-1.5">
        <button
          onClick={() => setActiveTab("topics")}
          className={`px-4 py-3 rounded-lg transition-all duration-200 relative text-left flex items-center gap-3 ${
            activeTab === "topics"
              ? "text-white bg-purple-500/20"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          Topics & Weightage
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-3 rounded-lg transition-all duration-200 relative text-left flex items-center gap-3 ${
            activeTab === "questions"
              ? "text-white bg-purple-500/20"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <Filter className="w-4 h-4" />
          </div>
          Questions
        </button>
      </div>
    </div>
  );
}
