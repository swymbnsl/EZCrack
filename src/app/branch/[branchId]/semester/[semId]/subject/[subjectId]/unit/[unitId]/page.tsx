"use client"

import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Header } from "@/components/layout/Header"
import { UnitContent } from "@/components/topics"
import { useUnitData } from "@/hooks/useUnitData"

export default function UnitPage() {
  const params = useParams()
  const { branchId, semId, subjectId, unitId } = params

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || ""
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || ""

  const {
    unit,
    isLoading,
    contributor,
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    yearFilter,
    setYearFilter,
    availableYears,
    sortedTopics,
    showNotesModal,
    setShowNotesModal,
    selectedTopicNotes,
    showFormulaSheetModal,
    setShowFormulaSheetModal,
    showAnswerModal,
    setShowAnswerModal,
    selectedAnswer,
    setSelectedAnswer,
    handleTopicClick,
    hasTopicNotes,
  } = useUnitData({
    unitId: unitId as string,
    subjectId: subjectId as string,
  })

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen h-full md:h-screen flex flex-col overflow-auto md:overflow-hidden">
        <div className="md:sticky md:top-0 md:z-20 bg-inherit">
          <Header
            branchId={parsedBranchId}
            semId={parsedSemId}
            backLink={`/branch/${parsedBranchId}/semester/${parsedSemId}/subject/${subjectId}`}
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
          isLoading={isLoading}
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
    </PageWrapper>
  )
}
