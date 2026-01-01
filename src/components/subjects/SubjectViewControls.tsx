import {
  ViewModeToggle,
  ExamTypeFilter,
  RepeatedTypeToggle,
} from "@/components/shared"
import type { ViewMode, ExamFilter, RepeatedType } from "@/types"

interface SubjectViewControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  examFilter: ExamFilter
  onExamFilterChange: (filter: ExamFilter) => void
  repeatedType: RepeatedType
  onRepeatedTypeChange: (type: RepeatedType) => void
}

export function SubjectViewControls({
  viewMode,
  onViewModeChange,
  examFilter,
  onExamFilterChange,
  repeatedType,
  onRepeatedTypeChange,
}: SubjectViewControlsProps) {
  return (
    <div className="mb-4 sm:mb-8">
      <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />

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
  )
}
