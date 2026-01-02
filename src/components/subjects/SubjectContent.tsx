"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Calendar, Repeat } from "lucide-react"
import { UnitCard } from "@/components/units/UnitCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import {
  AnswerModal,
  YearwiseQuestionsView,
  RepeatedQuestionsView,
} from "@/components/questions"
import {
  ViewModeToggle,
  ExamTypeFilter,
  RepeatedTypeToggle,
} from "@/components/shared"
import { sortUnitsByNumber } from "@/utils"
import type {
  Unit,
  Question,
  ViewMode,
  ExamFilter,
  RepeatedType,
} from "@/types"

interface SubjectContentProps {
  units: Unit[]
  isLoading: boolean
  branchId: string
  semId: string
  subjectId: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  examFilter: ExamFilter
  onExamFilterChange: (filter: ExamFilter) => void
  repeatedType: RepeatedType
  onRepeatedTypeChange: (type: RepeatedType) => void
  questionsByYear: Record<
    number,
    { total: number; byUnit: Record<number, Question[]> }
  >
  sortedYears: number[]
  expandedYears: Record<number, boolean>
  onToggleYear: (year: number) => void
  expandedUnits: Record<number, boolean>
  onToggleUnit: (unitNumber: number) => void
  showAnswerModal: boolean
  onShowAnswerModal: (show: boolean) => void
  selectedAnswer: { question: string; answer: string } | null
  onSelectAnswer: (answer: { question: string; answer: string } | null) => void
}

export function SubjectContent({
  units,
  isLoading,
  branchId,
  semId,
  subjectId,
  viewMode,
  onViewModeChange,
  examFilter,
  onExamFilterChange,
  repeatedType,
  onRepeatedTypeChange,
  questionsByYear,
  sortedYears,
  expandedYears,
  onToggleYear,
  expandedUnits,
  onToggleUnit,
  showAnswerModal,
  onShowAnswerModal,
  selectedAnswer,
  onSelectAnswer,
}: SubjectContentProps) {
  const handleAnswerClick = (question: string, answer: string) => {
    onSelectAnswer({ question, answer })
    onShowAnswerModal(true)
  }

  const hasRepeatedQuestions = units.some(
    (unit) =>
      unit.repeatedQuestions &&
      ((repeatedType === "concept" &&
        unit.repeatedQuestions.conceptBased.length > 0) ||
        (repeatedType === "pattern" &&
          unit.repeatedQuestions.patternBased.length > 0))
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading content..." />
  }

  return (
    <>
      <div className="mb-4 sm:mb-8">
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        {viewMode === "yearwise" && (
          <ExamTypeFilter
            examFilter={examFilter}
            onExamFilterChange={onExamFilterChange}
          />
        )}

        {viewMode === "repeated" && (
          <RepeatedTypeToggle
            repeatedType={repeatedType}
            onRepeatedTypeChange={onRepeatedTypeChange}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "units" ? (
          <motion.div
            key="units"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
          >
            {units.length > 0 ? (
              sortUnitsByNumber(units).map((unit, index) => (
                <UnitCard
                  key={unit._id}
                  unit={{
                    ...unit,
                    topics: Array.isArray(unit.topics)
                      ? (unit.topics as string[])
                      : [],
                  }}
                  index={index}
                  branchId={branchId}
                  semId={semId}
                  subjectId={subjectId}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={BookOpen}
                  title="No Units Available"
                  description="This subject doesn't have any units yet. Check back later for updates."
                />
              </div>
            )}
          </motion.div>
        ) : viewMode === "yearwise" ? (
          sortedYears.length > 0 ? (
            <YearwiseQuestionsView
              questionsByYear={questionsByYear}
              sortedYears={sortedYears}
              expandedYears={expandedYears}
              onToggleYear={onToggleYear}
              onAnswerClick={handleAnswerClick}
            />
          ) : (
            <motion.div
              key="yearwise-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EmptyState
                icon={Calendar}
                title="No Questions Available"
                description={
                  examFilter !== "all"
                    ? `No ${examFilter} questions found. Try selecting 'All Exams'.`
                    : "No questions available for this subject yet."
                }
              />
            </motion.div>
          )
        ) : hasRepeatedQuestions ? (
          <RepeatedQuestionsView
            units={units}
            repeatedType={repeatedType}
            expandedUnits={expandedUnits}
            onToggleUnit={onToggleUnit}
            onAnswerClick={handleAnswerClick}
          />
        ) : (
          <motion.div
            key="repeated-empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EmptyState
              icon={Repeat}
              title="No Repeated Questions"
              description={`There are no repeated ${
                repeatedType === "concept" ? "concept-based" : "pattern-based"
              } questions available for this subject yet.`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnswerModal
        isOpen={showAnswerModal}
        onClose={() => {
          onShowAnswerModal(false)
          onSelectAnswer(null)
        }}
        question={selectedAnswer?.question || ""}
        answer={selectedAnswer?.answer || ""}
      />
    </>
  )
}
