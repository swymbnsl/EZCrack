"use client"

import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Header } from "@/components/layout/Header"
import { ScrollableContent } from "@/components/layout/ScrollableContent"
import { SubjectContent } from "@/components/subjects"
import { useSubjectData } from "@/hooks/useSubjectData"
import { parseRouteParam, buildRoutePath } from "@/utils"

export default function SubjectPage() {
  const params = useParams()
  const subjectId = parseRouteParam(params.subjectId)
  const branchId = parseRouteParam(params.branchId)
  const semId = parseRouteParam(params.semId)

  const {
    units,
    subject,
    isLoading,
    contributor,
    viewMode,
    setViewMode,
    examFilter,
    setExamFilter,
    repeatedType,
    setRepeatedType,
    questionsByYear,
    sortedYears,
    expandedYears,
    toggleYear,
    expandedUnits,
    toggleUnit,
    showAnswerModal,
    setShowAnswerModal,
    selectedAnswer,
    setSelectedAnswer,
    stats,
    subtitle,
  } = useSubjectData({ subjectId })

  const backLink = buildRoutePath("/branch", branchId, "semester", semId)

  return (
    <PageWrapper>
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
            isLoading={isLoading}
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
    </PageWrapper>
  )
}
