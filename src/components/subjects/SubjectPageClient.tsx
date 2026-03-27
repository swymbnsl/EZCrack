"use client"

import { useState, useMemo, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { ScrollableContent } from "@/components/layout/ScrollableContent"
import { SubjectContent } from "@/components/subjects"
import { sortYearsDescending, filterByExamType } from "@/utils"
import type {
  Unit,
  Question,
  Subject,
  Contributor,
  ViewMode,
  ExamFilter,
  RepeatedType,
} from "@/types"

interface QuestionsByYear {
  total: number
  byUnit: Record<number, Question[]>
}

interface SubjectPageClientProps {
  units: Unit[]
  questions: Question[]
  subject: Subject | null
  contributor: Contributor | undefined
  branchId: string
  semId: string
  subjectId: string
  backLink: string
}

export function SubjectPageClient({
  units,
  questions,
  subject,
  contributor,
  branchId,
  semId,
  subjectId,
  backLink,
}: SubjectPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("units")
  const [examFilter, setExamFilter] = useState<ExamFilter>("all")
  const [repeatedType, setRepeatedType] = useState<RepeatedType>("concept")
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {}
  )
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>(
    {}
  )
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<{
    question: string
    answer: string
  } | null>(null)

  // Filter questions by exam type
  const filteredQuestions = useMemo(() => {
    return filterByExamType(questions, examFilter)
  }, [questions, examFilter])

  // Group questions by year
  const questionsByYear = useMemo(() => {
    return filteredQuestions.reduce((acc, question) => {
      const year = question.year as number
      if (!acc[year]) {
        acc[year] = { total: 0, byUnit: {} as Record<number, Question[]> }
      }
      if (!acc[year].byUnit[question.unit]) {
        acc[year].byUnit[question.unit] = []
      }
      acc[year].byUnit[question.unit].push(question)
      acc[year].total++
      return acc
    }, {} as Record<number, QuestionsByYear>)
  }, [filteredQuestions])

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return sortYearsDescending(Object.keys(questionsByYear).map(Number))
  }, [questionsByYear])

  // Calculate total topics count
  const totalTopics = useMemo(() => {
    return units.reduce(
      (acc, unit) =>
        acc + (Array.isArray(unit.topics) ? unit.topics.length : 0),
      0
    )
  }, [units])

  // Toggle handlers
  const toggleYear = useCallback((year: number) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }))
  }, [])

  const toggleUnit = useCallback((unitNumber: number) => {
    setExpandedUnits((prev) => ({ ...prev, [unitNumber]: !prev[unitNumber] }))
  }, [])

  // Stats calculations
  const stats = useMemo(() => {
    const yearText = sortedYears.length === 1 ? "year" : "years"

    return {
      primary: {
        value: viewMode === "units" ? units.length : sortedYears.length,
        label: viewMode === "units" ? "Units" : yearText,
      },
      secondary: {
        value: viewMode === "units" ? totalTopics : filteredQuestions.length,
        label: viewMode === "units" ? "Topics" : "Questions",
      },
    }
  }, [
    viewMode,
    units.length,
    totalTopics,
    sortedYears.length,
    filteredQuestions.length,
  ])

  // Subtitle text
  const subtitle = useMemo(() => {
    const yearText = sortedYears.length === 1 ? "year" : "years"

    return viewMode === "units"
      ? `${units.length} units to explore`
      : `${filteredQuestions.length} questions across ${sortedYears.length} ${yearText}`
  }, [viewMode, units.length, filteredQuestions.length, sortedYears.length])

  return (
    <div className="relative min-h-screen flex flex-col sm:h-screen overflow-auto sm:overflow-hidden">
      <div className="z-20 bg-inherit sm:sticky sm:top-0">
        <Header
          branchId={branchId}
          semId={semId}
          backLink={backLink}
          backText="Back to Subjects"
          title={subject?.name || "Loading..."}
          subtitle={subtitle}
          stats={stats}
          contributor={contributor}
        />
      </div>

      <ScrollableContent>
        <SubjectContent
          units={units}
          isLoading={false}
          branchId={branchId}
          semId={semId}
          subjectId={subjectId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          examFilter={examFilter}
          onExamFilterChange={setExamFilter}
          repeatedType={repeatedType}
          onRepeatedTypeChange={setRepeatedType}
          questionsByYear={questionsByYear}
          sortedYears={sortedYears}
          expandedYears={expandedYears}
          onToggleYear={toggleYear}
          expandedUnits={expandedUnits}
          onToggleUnit={toggleUnit}
          showAnswerModal={showAnswerModal}
          onShowAnswerModal={setShowAnswerModal}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
        />
      </ScrollableContent>
    </div>
  )
}
