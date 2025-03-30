import { BookOpen, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface UnitTabsProps {
  activeTab: "topics" | "questions";
  setActiveTab: (tab: "topics" | "questions") => void;
}

export function UnitTabs({ activeTab, setActiveTab }: UnitTabsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="space-y-2">
      <h3 className={`text-sm font-medium ${
        isLight ? "text-gray-600" : "text-gray-400"
      } mb-4 flex items-center gap-2`}>
        <FileText className="w-4 h-4" />
        View Mode
      </h3>

      <div className={`${
        isLight 
          ? "bg-white border-black" 
          : "bg-[#1E1E1E] border-white"
      } border-4 overflow-hidden`}>
        <button
          onClick={() => setActiveTab("topics")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            activeTab === "topics"
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
              activeTab === "topics"
                ? isLight 
                  ? "bg-white border-black" 
                  : "bg-[#1E1E1E] border-white"
                : isLight 
                  ? "bg-[#F5F5F5] border-black" 
                  : "bg-[#252525] border-white"
            } border-2 flex items-center justify-center`}
          >
            <BookOpen
              className={`w-4 h-4 ${
                isLight ? "text-black" : "text-white"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Topics Overview</span>
            <span className={`text-xs ${
              activeTab === "topics"
                ? isLight 
                  ? "text-black opacity-80" 
                  : "text-black opacity-80"
                : isLight 
                  ? "text-gray-600" 
                  : "text-gray-400"
            }`}>
              View weightage and analysis
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all ${
            activeTab === "questions"
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
              activeTab === "questions"
                ? isLight 
                  ? "bg-white border-black" 
                  : "bg-[#1E1E1E] border-white"
                : isLight 
                  ? "bg-[#F5F5F5] border-black" 
                  : "bg-[#252525] border-white"
            } border-2 flex items-center justify-center`}
          >
            <FileText
              className={`w-4 h-4 ${
                isLight ? "text-black" : "text-white"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Questions</span>
            <span className={`text-xs ${
              activeTab === "questions"
                ? isLight 
                  ? "text-black opacity-80" 
                  : "text-black opacity-80"
                : isLight 
                  ? "text-gray-600" 
                  : "text-gray-400"
            }`}>
              Browse all questions by topic
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
