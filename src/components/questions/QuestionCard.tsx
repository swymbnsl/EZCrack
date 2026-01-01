"use client"

import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface QuestionCardProps {
  question: string
  marks: number
  year: number | string
  midsem: boolean
  topics?: string[]
  answer?: string
  onShowAnswer?: () => void
  index?: number
  animationDelay?: number
  variant?: "default" | "compact"
}

export function QuestionCard({
  question,
  marks,
  year,
  midsem,
  topics = [],
  answer,
  onShowAnswer,
  index = 0,
  animationDelay = 0,
  variant = "default",
}: QuestionCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  const examType = midsem ? "Midterm" : "Endterm"

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: animationDelay }}
        className="group relative border-3 p-3 sm:p-5 transition-all"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: `${colors.border}B3`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = colors.border
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${colors.border}B3`
        }}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center text-xs">
              {/* Desktop badges */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                <span
                  className="text-sm font-medium px-3 py-1.5 border-2"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.textOnPrimary,
                    borderColor: colors.border,
                  }}
                >
                  {year}
                </span>
                <span
                  className="text-sm font-medium px-3 py-1.5 border-2"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.textOnAccent,
                    borderColor: colors.border,
                  }}
                >
                  {marks} marks
                </span>
                <span
                  className="text-sm font-medium px-3 py-1.5 border-2"
                  style={{
                    backgroundColor: midsem ? colors.warning : colors.error,
                    color: "#000000",
                    borderColor: colors.border,
                  }}
                >
                  {examType}
                </span>
              </div>
              {/* Mobile badges */}
              <div
                className="sm:hidden flex items-center text-xs"
                style={{
                  borderLeftWidth: "1px",
                  borderColor: colors.border,
                }}
              >
                <span
                  className="font-medium pr-2"
                  style={{ color: colors.text }}
                >
                  {year}
                </span>
                <span
                  className="font-medium px-2"
                  style={{
                    color: colors.primary,
                    borderLeftWidth: "1px",
                    borderColor: colors.border,
                  }}
                >
                  {marks}m
                </span>
                <span
                  className="font-medium pl-2"
                  style={{
                    color: midsem ? colors.warning : colors.error,
                    borderLeftWidth: "1px",
                    borderColor: colors.border,
                  }}
                >
                  {midsem ? "Mid" : "End"}
                </span>
              </div>
            </div>
            <MarkdownRenderer
              content={question}
              className="text-sm sm:text-base"
            />
          </div>
          {answer && onShowAnswer && (
            <button
              onClick={onShowAnswer}
              className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 border-2 flex items-center justify-center transition-colors"
              style={{
                backgroundColor: colors.primary,
                borderColor: colors.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"
              }}
              title="View Answer"
            >
              <MessageSquare
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: colors.textOnPrimary }}
              />
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <div
      className="border-2 p-3 sm:p-4"
      style={{
        backgroundColor: colors.backgroundCard,
        borderColor: colors.border,
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-2 items-start mb-2">
            <div
              className="px-1.5 py-0.5 text-xs border-2"
              style={{
                backgroundColor: midsem ? colors.secondary : colors.error,
                color: "#000000",
                borderColor: colors.border,
              }}
            >
              {examType}
            </div>
            <div
              className="px-1.5 py-0.5 text-xs border-2"
              style={{
                backgroundColor: colors.primary,
                color: colors.textOnPrimary,
                borderColor: colors.border,
              }}
            >
              {marks} marks
            </div>
          </div>
          <MarkdownRenderer
            content={question}
            className="text-sm sm:text-base"
          />
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs px-1.5 py-0.5 inline-flex items-center border"
                  style={{
                    backgroundColor: colors.backgroundMuted,
                    color: colors.text,
                    borderColor: colors.border,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
        {answer && onShowAnswer && (
          <button
            onClick={onShowAnswer}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 border-2 flex items-center justify-center transition-colors"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.8"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1"
            }}
            title="View Answer"
          >
            <MessageSquare
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: colors.textOnPrimary }}
            />
          </button>
        )}
      </div>
    </div>
  )
}
