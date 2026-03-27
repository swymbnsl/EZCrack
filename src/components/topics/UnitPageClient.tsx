"use client"

import { useState, useMemo, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { UnitContent } from "@/components/topics"
import { sortYearsDescending, sortTopicsByWeightage } from "@/utils"
import type {
  Topic,
  Note,
  UnitWithTopics,
  Contributor,
  SortOrder,
  YearFilter,
  TabType,
} from "@/types"

interface UnitPageClientProps {
  unit: UnitWithTopics
  contributor: Contributor | undefined
  branchId: string
  semId: string
  subjectId: string
}

export function UnitPageClient({
  unit,
  contributor,
  branchId,
  semId,
  subjectId,
}: UnitPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("topics")
  const [sortOrder, setSortOrder] = useState<SortOrder>("original")
  const [yearFilter, setYearFilter] = useState<YearFilter>("all")
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedTopicNotes, setSelectedTopicNotes] = useState<Note | null>(
    null
  )
  const [showFormulaSheetModal, setShowFormulaSheetModal] = useState(false)
  const [showAnswerModal, setShowAnswerModal] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<{
    question: string
    answer: string
  } | null>(null)

  const handleTopicClick = useCallback(
    (topicTitle: string) => {
      if (unit?.notes) {
        const note = unit.notes.find((note) => note.topic === topicTitle)
        if (note) {
          setSelectedTopicNotes(note)
          setShowNotesModal(true)
        } else {
          setActiveTab("questions")
        }
      } else {
        setActiveTab("questions")
      }
    },
    [unit]
  )

  const hasTopicNotes = useCallback(
    (topicTitle: string) => {
      return unit?.notes?.some((note) => note.topic === topicTitle) || false
    },
    [unit]
  )

  const sortedTopics: Topic[] = useMemo(() => {
    if (!unit) return []

    let filtered = [...unit.topics]

    if (yearFilter !== "all") {
      filtered = filtered.filter((topic) =>
        topic.years.includes(yearFilter as number)
      )
    }

    if (sortOrder === "original") {
      return filtered
    }

    if (sortOrder === "asc") {
      return sortTopicsByWeightage<Topic>(filtered, "weightage", "asc")
    } else {
      return sortTopicsByWeightage<Topic>(filtered)
    }
  }, [unit, sortOrder, yearFilter])

  const availableYears = useMemo(() => {
    if (!unit) return []

    const years = new Set<number>()
    unit.topics.forEach((topic) => {
      topic.years.forEach((year) => years.add(year))
    })

    return sortYearsDescending(Array.from(years))
  }, [unit])

  return (
    <div className="relative z-10 min-h-screen h-full md:h-screen flex flex-col overflow-auto md:overflow-hidden">
      <div className="md:sticky md:top-0 md:z-20 bg-inherit">
        <Header
          branchId={branchId}
          semId={semId}
          backLink={`/branch/${branchId}/semester/${semId}/subject/${subjectId}`}
          backText="Back to Units"
          title={`Unit ${unit?.number || ""}`}
          subtitle={`${unit?.topics.length || 0} topics to explore`}
          showWeightageInfo={true}
          stats={{
            primary: { value: unit?.topics.length || 0, label: "Topics" },
            secondary: { value: availableYears?.length || 0, label: "Years" },
          }}
          contributor={contributor}
        />
      </div>

      <UnitContent
        unit={unit}
        isLoading={false}
        sortedTopics={sortedTopics}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        availableYears={availableYears}
        showNotesModal={showNotesModal}
        onShowNotesModal={setShowNotesModal}
        selectedTopicNotes={selectedTopicNotes}
        showFormulaSheetModal={showFormulaSheetModal}
        onShowFormulaSheetModal={setShowFormulaSheetModal}
        showAnswerModal={showAnswerModal}
        onShowAnswerModal={setShowAnswerModal}
        selectedAnswer={selectedAnswer}
        onSelectAnswer={setSelectedAnswer}
        onTopicClick={handleTopicClick}
        hasTopicNotes={hasTopicNotes}
      />
    </div>
  )
}
