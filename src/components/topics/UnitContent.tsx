"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, FileQuestion, AlertCircle } from "lucide-react"
import { TopicCard } from "@/components/topics/TopicCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import { QuestionItem } from "@/components/questions/QuestionItem"
import { UnitSidebar } from "@/components/units/UnitSidebar"
import { UnitFiltersMobile } from "@/components/units/UnitFiltersMobile"
import { NotesModal } from "@/components/notes/NotesModal"
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal"
import { AnswerModal } from "@/components/questions/AnswerModal"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"
import type {
  Topic,
  Note,
  UnitWithTopics,
  SortOrder,
  YearFilter,
  TabType,
} from "@/types"

interface UnitContentProps {
  unit: UnitWithTopics | null
  isLoading: boolean
  sortedTopics: Topic[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  sortOrder: SortOrder
  onSortOrderChange: (order: SortOrder) => void
  yearFilter: YearFilter
  onYearFilterChange: (filter: YearFilter) => void
  availableYears: number[]
  showNotesModal: boolean
  onShowNotesModal: (show: boolean) => void
  selectedTopicNotes: Note | null
  showFormulaSheetModal: boolean
  onShowFormulaSheetModal: (show: boolean) => void
  showAnswerModal: boolean
  onShowAnswerModal: (show: boolean) => void
  selectedAnswer: { question: string; answer: string } | null
  onSelectAnswer: (answer: { question: string; answer: string } | null) => void
  onTopicClick: (topicTitle: string) => void
  hasTopicNotes: (topicTitle: string) => boolean
}

export function UnitContent({
  unit,
  isLoading,
  sortedTopics,
  activeTab,
  onTabChange,
  sortOrder,
  onSortOrderChange,
  yearFilter,
  onYearFilterChange,
  availableYears,
  showNotesModal,
  onShowNotesModal,
  selectedTopicNotes,
  showFormulaSheetModal,
  onShowFormulaSheetModal,
  showAnswerModal,
  onShowAnswerModal,
  selectedAnswer,
  onSelectAnswer,
  onTopicClick,
  hasTopicNotes,
}: UnitContentProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  const handleAnswerClick = (question: string, answer: string) => {
    onSelectAnswer({ question, answer })
    onShowAnswerModal(true)
  }

  return (
    <>
      <div
        className="flex-1 flex flex-col sm:flex-row sm:overflow-hidden mt-2 sm:mt-0"
        style={{
          background: isLight
            ? `${colors.background}`
            : `linear-gradient(to bottom, #0a0a0a, ${colors.background})`,
        }}
      >
        {/* Desktop Sidebar */}
        <div
          className={`hidden sm:block sm:w-auto sm:min-w-[320px] h-full overflow-y-auto scrollbar-thin ${
            isLight
              ? "bg-[#EFEFEF] scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/60"
              : "scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50"
          } scrollbar-thumb-rounded-full`}
        >
          <UnitSidebar
            activeTab={activeTab}
            onTabChange={onTabChange}
            sortOrder={sortOrder}
            onSortOrderChange={onSortOrderChange}
            yearFilter={yearFilter}
            onYearFilterChange={onYearFilterChange}
            availableYears={availableYears}
            hasFormulaSheet={!!unit?.formulaSheet?.content}
            onFormulaSheetClick={() => onShowFormulaSheetModal(true)}
          />
        </div>

        {/* Mobile Filters */}
        <UnitFiltersMobile
          activeTab={activeTab}
          onTabChange={onTabChange}
          sortOrder={sortOrder}
          onSortOrderChange={onSortOrderChange}
          yearFilter={yearFilter}
          onYearFilterChange={onYearFilterChange}
          availableYears={availableYears}
          hasFormulaSheet={!!unit?.formulaSheet?.content}
          onFormulaSheetClick={() => onShowFormulaSheetModal(true)}
        />

        {/* Main Content */}
        <div
          className="flex-1 sm:h-full sm:overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full"
          style={{
            scrollbarColor: isLight
              ? "rgba(156, 163, 175, 0.4) rgba(229, 231, 235, 0.4)"
              : "rgba(75, 85, 99, 0.4) rgba(31, 41, 55, 0.4)",
          }}
        >
          <div className="p-3 sm:p-8">
            {isLoading ? (
              <LoadingSpinner text="Loading content..." />
            ) : unit ? (
              <AnimatePresence mode="wait">
                {activeTab === "topics" ? (
                  <TopicsView
                    topics={sortedTopics}
                    onTopicClick={onTopicClick}
                    hasTopicNotes={hasTopicNotes}
                  />
                ) : (
                  <QuestionsView
                    topics={sortedTopics}
                    yearFilter={yearFilter}
                    colors={colors}
                    onAnswerClick={handleAnswerClick}
                  />
                )}
              </AnimatePresence>
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="Unit Not Available"
                description="This unit's content is not available or could not be loaded."
                iconColor="text-red-400"
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => onShowNotesModal(false)}
        note={selectedTopicNotes}
      />

      <FormulaSheetModal
        isOpen={showFormulaSheetModal}
        onClose={() => onShowFormulaSheetModal(false)}
        formulaSheet={unit?.formulaSheet || null}
        unitNumber={unit?.number || 0}
      />

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

// Sub-components for Topics and Questions views
interface TopicsViewProps {
  topics: Topic[]
  onTopicClick: (topicTitle: string) => void
  hasTopicNotes: (topicTitle: string) => boolean
}

function TopicsView({ topics, onTopicClick, hasTopicNotes }: TopicsViewProps) {
  if (!topics || topics.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Topics Available"
        description="This unit doesn't have any topics yet. Check back later for updates."
      />
    )
  }

  return (
    <motion.div
      key="topics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 auto-rows-fr"
    >
      {topics.map((topic, index) => (
        <TopicCard
          key={topic.title + "-" + index}
          topic={topic}
          index={index}
          onTopicClick={() => onTopicClick(topic.title)}
          hasNotes={hasTopicNotes(topic.title)}
        />
      ))}
    </motion.div>
  )
}

interface QuestionsViewProps {
  topics: Topic[]
  yearFilter: YearFilter
  colors: typeof lightTheme | typeof darkTheme
  onAnswerClick: (question: string, answer: string) => void
}

function QuestionsView({
  topics,
  yearFilter,
  colors,
  onAnswerClick,
}: QuestionsViewProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="col-span-2">
        <EmptyState
          icon={FileQuestion}
          title="No Questions Available"
          description="There are no questions available for this unit yet."
          iconColor="text-amber-400"
        />
      </div>
    )
  }

  return (
    <motion.div
      key="questions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-8"
    >
      {topics.map((topic, topicIndex) => {
        const filteredQuestions = topic.questions.filter(
          (q) => yearFilter === "all" || q.year === yearFilter
        )

        return (
          <motion.div
            key={topic.title + "-" + topicIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: topicIndex * 0.1 }}
            className="border-4 rounded-xl overflow-hidden"
            style={{
              backgroundColor: colors.backgroundCard,
              borderColor: colors.border,
            }}
          >
            <div
              className="px-6 py-4 border-b-4 flex items-center justify-between"
              style={{ borderColor: colors.border }}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="min-w-10 min-h-10 border-3 flex items-center justify-center"
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
                <h2
                  className="text-lg font-semibold break-words"
                  style={{ color: colors.text }}
                >
                  {topic.title}
                </h2>
              </div>
              <span
                className="text-sm shrink-0 ml-3 border-2 px-3 py-1.5 rounded-none"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                <span className="hidden sm:inline">
                  {filteredQuestions.length} questions
                </span>
                <span className="sm:hidden">{filteredQuestions.length} Qs</span>
              </span>
            </div>
            <div
              className="p-6 space-y-4 h-full"
              style={{
                backgroundColor: colors.backgroundQuestionViewCard + "B3",
              }}
            >
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question, qIndex) => (
                  <motion.div
                    key={question.id + "-" + qIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: topicIndex * 0.1 + qIndex * 0.05,
                    }}
                  >
                    <QuestionItem
                      question={question.text}
                      answer={question.answer}
                      marks={question.marks}
                      year={question.year}
                      examType={question.midsem ? "midterm" : "endterm"}
                      showYearBadge={true}
                      showTopics={false}
                      image_urls={question.image_urls}
                      onAnswerClick={onAnswerClick}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="py-8">
                  <EmptyState
                    icon={FileQuestion}
                    title="No Questions Available"
                    description={
                      yearFilter !== "all"
                        ? `No questions found for ${yearFilter}. Try selecting a different year.`
                        : "No questions available for this topic yet."
                    }
                    iconColor="text-amber-400"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
