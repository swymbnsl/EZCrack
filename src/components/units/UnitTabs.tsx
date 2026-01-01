import { BookOpen, FileText } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type { TabType } from "@/types"

interface UnitTabsProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function UnitTabs({ activeTab, setActiveTab }: UnitTabsProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div className="space-y-2">
      <h3
        className="text-sm font-medium mb-4 flex items-center gap-2"
        style={{ color: colors.textMuted }}
      >
        <FileText className="w-4 h-4" />
        View Mode
      </h3>

      <div
        className="border-4 overflow-hidden"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
        }}
      >
        <button
          onClick={() => setActiveTab("topics")}
          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b-4"
          style={{
            backgroundColor:
              activeTab === "topics" ? colors.primary : "transparent",
            color: activeTab === "topics" ? colors.textOnPrimary : colors.text,
            borderColor: colors.border,
          }}
        >
          <div
            className="w-8 h-8 border-2 flex items-center justify-center"
            style={{
              backgroundColor:
                activeTab === "topics"
                  ? colors.backgroundCard
                  : colors.backgroundMuted,
              borderColor: colors.border,
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: colors.text }} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Topics Overview</span>
            <span
              className="text-xs"
              style={{
                color:
                  activeTab === "topics" ? "rgba(0,0,0,0.8)" : colors.textMuted,
              }}
            >
              View weightage and analysis
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className="w-full text-left px-4 py-3 flex items-center gap-3 transition-all"
          style={{
            backgroundColor:
              activeTab === "questions" ? colors.primary : "transparent",
            color:
              activeTab === "questions" ? colors.textOnPrimary : colors.text,
          }}
        >
          <div
            className="w-8 h-8 border-2 flex items-center justify-center"
            style={{
              backgroundColor:
                activeTab === "questions"
                  ? colors.backgroundCard
                  : colors.backgroundMuted,
              borderColor: colors.border,
            }}
          >
            <FileText className="w-4 h-4" style={{ color: colors.text }} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Questions</span>
            <span
              className="text-xs"
              style={{
                color:
                  activeTab === "questions"
                    ? "rgba(0,0,0,0.8)"
                    : colors.textMuted,
              }}
            >
              Browse all questions by topic
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
