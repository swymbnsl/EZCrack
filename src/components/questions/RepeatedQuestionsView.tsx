"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ChevronDown } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import { QuestionItem } from "@/components/questions/QuestionItem"
import { sortUnitsByNumber } from "@/utils"
import type { Unit, RepeatedType } from "@/types"

interface RepeatedQuestionsViewProps {
  units: Unit[]
  repeatedType: RepeatedType
  expandedUnits: Record<number, boolean>
  onToggleUnit: (unitNumber: number) => void
  onAnswerClick: (question: string, answer: string) => void
}

export function RepeatedQuestionsView({
  units,
  repeatedType,
  expandedUnits,
  onToggleUnit,
  onAnswerClick,
}: RepeatedQuestionsViewProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  const filteredUnits = sortUnitsByNumber(
    units.filter(
      (unit) =>
        unit.repeatedQuestions &&
        ((repeatedType === "concept" &&
          unit.repeatedQuestions.conceptBased.length > 0) ||
          (repeatedType === "pattern" &&
            unit.repeatedQuestions.patternBased.length > 0))
    )
  )

  return (
    <motion.div
      key="repeated"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {filteredUnits.map((unit) => (
        <div
          key={unit._id}
          className="border-4 overflow-hidden"
          style={{
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
          }}
        >
          <button
            onClick={() => onToggleUnit(unit.number)}
            className="w-full p-4 sm:p-6 border-b-4 transition-colors flex items-center justify-between"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 border-3 flex items-center justify-center"
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.border,
                }}
              >
                <BookOpen
                  className="w-5 h-5"
                  style={{ color: colors.textOnPrimary }}
                />
              </div>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                Unit {unit.number} - Repeated Questions
              </h2>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                expandedUnits[unit.number] ? "rotate-180" : ""
              }`}
              style={{ color: colors.text }}
            />
          </button>

          <AnimatePresence>
            {expandedUnits[unit.number] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 sm:p-6 space-y-4">
                  {repeatedType === "concept" ? (
                    <ConceptBasedQuestions
                      questions={unit.repeatedQuestions?.conceptBased || []}
                      onAnswerClick={onAnswerClick}
                    />
                  ) : (
                    <PatternBasedQuestions
                      questions={unit.repeatedQuestions?.patternBased || []}
                      onAnswerClick={onAnswerClick}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  )
}

interface ConceptBasedQuestionsProps {
  questions: {
    concept: string
    frequency: number
    questions: {
      question: string
      year: string
      examType: string
      answer?: string
      image_urls?: string[]
    }[]
  }[]
  onAnswerClick: (question: string, answer: string) => void
}

function ConceptBasedQuestions({
  questions,
  onAnswerClick,
}: ConceptBasedQuestionsProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div className="space-y-4">
      {questions.map((concept, i) => (
        <div
          key={`concept-${i}`}
          className="border-2 p-4"
          style={{
            backgroundColor: colors.backgroundMuted,
            borderColor: colors.border,
          }}
        >
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                {concept.concept}
              </h3>
              <span
                className="inline-flex items-center text-sm px-2 py-1 border-2"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                {concept.frequency}x frequent
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {concept.questions.map((question, j) => (
                <QuestionItem
                  key={`concept-q-${j}`}
                  question={question.question}
                  answer={question.answer}
                  year={question.year}
                  examType={question.examType as "midterm" | "endterm"}
                  image_urls={question.image_urls}
                  showYearBadge={true}
                  showMarksBadge={false}
                  showTopics={false}
                  onAnswerClick={onAnswerClick}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface PatternBasedQuestionsProps {
  questions: {
    pattern: string
    frequency: number
    questions: {
      question: string
      year: string
      examType: string
      answer?: string
      image_urls?: string[]
    }[]
  }[]
  onAnswerClick: (question: string, answer: string) => void
}

function PatternBasedQuestions({
  questions,
  onAnswerClick,
}: PatternBasedQuestionsProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div className="space-y-4">
      {questions.map((pattern, i) => (
        <div
          key={`pattern-${i}`}
          className="border-2 p-4"
          style={{
            backgroundColor: colors.backgroundMuted,
            borderColor: colors.border,
          }}
        >
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold" style={{ color: colors.text }}>
                {pattern.pattern}
              </h3>
              <span
                className="inline-flex items-center text-sm px-2 py-1 border-2"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                {pattern.frequency}x frequent
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {pattern.questions.map((question, j) => (
                <QuestionItem
                  key={`pattern-q-${j}`}
                  question={question.question}
                  answer={question.answer}
                  year={question.year}
                  examType={question.examType as "midterm" | "endterm"}
                  image_urls={question.image_urls}
                  showYearBadge={true}
                  showMarksBadge={false}
                  showTopics={false}
                  onAnswerClick={onAnswerClick}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
