"use client"

import { MessageSquare } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer"
import type { ExamType } from "@/types"

interface QuestionItemProps {
  question: string
  answer?: string
  marks?: number
  year?: string | number
  examType?: ExamType
  topics?: string[]
  image_urls?: string[]
  showExamBadge?: boolean
  showMarksBadge?: boolean
  showYearBadge?: boolean
  showTopics?: boolean
  onAnswerClick?: (question: string, answer: string) => void
}

const formatExamType = (examType: string) => {
  const type = examType.toLowerCase()
  return type === "midterm"
    ? "Midterm"
    : type === "endterm"
    ? "Endterm"
    : examType
}

export function QuestionItem({
  question,
  answer,
  marks,
  year,
  examType,
  topics = [],
  image_urls,
  showExamBadge = true,
  showMarksBadge = true,
  showYearBadge = false,
  showTopics = true,
  onAnswerClick,
}: QuestionItemProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div
      className={`p-3 sm:p-4 ${showTopics ? "border-2" : ""}`}
      style={{
        backgroundColor: colors.backgroundCard,
        borderColor: colors.border,
      }}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex gap-2 items-start mb-2 flex-wrap">
            {showYearBadge && year && (
              <div
                className={`${
                  showTopics ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
                } border-2`}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                  color: colors.textOnPrimary,
                }}
              >
                {year}
              </div>
            )}
            {showMarksBadge && marks !== undefined && (
              <div
                className={`${
                  showTopics ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
                } border-2`}
                style={{
                  backgroundColor: colors.warning,
                  borderColor: colors.border,
                  color: colors.textOnPrimary,
                }}
              >
                {marks} marks
              </div>
            )}
            {showExamBadge && examType && (
              <div
                className={`${
                  showTopics ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm"
                } border-2`}
                style={{
                  backgroundColor: colors.error,
                  borderColor: colors.border,
                  color: "#000000",
                }}
              >
                {formatExamType(examType)}
              </div>
            )}
          </div>
          <div
            className={`text-sm sm:text-base prose ${
              isLight ? "prose-black" : "prose-invert"
            } max-w-none ${isLight ? "light-katex" : ""}`}
            style={{ color: colors.text }}
          >
            <MarkdownRenderer content={question} />
          </div>
          {/* Display multiple images if available */}
          {image_urls && image_urls.length > 0 && (
            <div className="mt-3 flex flex-col gap-3">
              {image_urls.map((url, i) => (
                <div key={i} className="border-2 overflow-hidden bg-white/5" style={{ borderColor: colors.border }}>
                  <Image
                    src={url}
                    alt={`Question diagram ${i + 1}`}
                    width={500}
                    height={300}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              ))}
            </div>
          )}
          {showTopics && topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {topics.map((topic, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 inline-flex items-center border"
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
        {answer && onAnswerClick && (
          <button
            onClick={() => onAnswerClick(question, answer)}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 border-2 flex items-center justify-center transition-colors hover:opacity-80"
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.border,
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
