"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, BookOpen, ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import { QuestionItem } from "@/components/questions/QuestionItem"
import type { Question } from "@/types"

interface QuestionsByYear {
  [year: number]: {
    total: number
    byUnit: Record<number, Question[]>
  }
}

interface YearwiseQuestionsViewProps {
  questionsByYear: QuestionsByYear
  sortedYears: number[]
  expandedYears: Record<number, boolean>
  onToggleYear: (year: number) => void
  onAnswerClick: (question: string, answer: string) => void
}

export function YearwiseQuestionsView({
  questionsByYear,
  sortedYears,
  expandedYears,
  onToggleYear,
  onAnswerClick,
}: YearwiseQuestionsViewProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <motion.div
      key="yearwise"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {sortedYears.map((year) => (
        <div
          key={year}
          className="border-4 overflow-hidden"
          style={{
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => onToggleYear(year)}
            className="w-full px-3 sm:px-8 py-3 sm:py-5 flex items-center justify-between border-b-4 transition-colors"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 border-3 flex items-center justify-center"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                }}
              >
                <Calendar
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  style={{ color: colors.textOnPrimary }}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <h2
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {year}
                </h2>
                <span
                  className="text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 sm:py-1 border-2"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.textOnAccent,
                    borderColor: colors.border,
                  }}
                >
                  {questionsByYear[year] &&
                  questionsByYear[year].total &&
                  questionsByYear[year].total > 0
                    ? `${questionsByYear[year].total} questions`
                    : "No questions available"}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 ${expandedYears[year] ? "rotate-180" : ""}`}
              style={{ color: colors.text }}
            />
          </button>
          <AnimatePresence>
            {expandedYears[year] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-3 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
                  {Object.entries(questionsByYear[year].byUnit)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([unit, questions]) => (
                      <div key={unit}>
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div
                            className="w-6 h-6 sm:w-8 sm:h-8 border-2 flex items-center justify-center"
                            style={{
                              backgroundColor: colors.primary,
                              borderColor: colors.border,
                            }}
                          >
                            <BookOpen
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              style={{ color: colors.textOnPrimary }}
                            />
                          </div>
                          <h3
                            className="text-base sm:text-lg font-bold"
                            style={{ color: colors.text }}
                          >
                            Unit {unit}
                          </h3>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          {questions.map((question) => (
                            <QuestionItem
                              key={question._id}
                              question={question.question}
                              answer={question.answer}
                              marks={question.marks}
                              examType={question.midsem ? "midterm" : "endterm"}
                              topics={question.topics}
                              image_urls={question.image_urls}
                              showYearBadge={false}
                              onAnswerClick={onAnswerClick}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  )
}
