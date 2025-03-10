import { BookOpen, FileText } from "lucide-react";

interface UnitTabsProps {
  activeTab: "topics" | "questions";
  setActiveTab: (tab: "topics" | "questions") => void;
}

export function UnitTabs({ activeTab, setActiveTab }: UnitTabsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        View Mode
      </h3>

      <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setActiveTab("topics")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            activeTab === "topics"
              ? "bg-purple-500/20 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg ${
              activeTab === "topics" ? "bg-purple-500/20" : "bg-gray-700/50"
            } flex items-center justify-center`}
          >
            <BookOpen
              className={`w-4 h-4 ${
                activeTab === "topics" ? "text-purple-400" : "text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Topics Overview</span>
            <span className="text-xs text-gray-400">
              View weightage and analysis
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            activeTab === "questions"
              ? "bg-purple-500/20 text-white"
              : "text-gray-300 hover:bg-gray-700/50"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg ${
              activeTab === "questions" ? "bg-purple-500/20" : "bg-gray-700/50"
            } flex items-center justify-center`}
          >
            <FileText
              className={`w-4 h-4 ${
                activeTab === "questions" ? "text-purple-400" : "text-gray-400"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Questions</span>
            <span className="text-xs text-gray-400">
              Browse all questions by topic
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
