"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { BookOpen, Calendar, ChevronDown, Repeat } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/layout/Header"
import { UnitCard } from "@/components/units/UnitCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import axios from "axios"
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { useTheme } from "@/contexts/ThemeContext"
import { useContributors } from "@/contexts/ContributorsContext"

const formatExamType = (examType: string) => {
  const type = examType.toLowerCase()
  return type === "midterm"
    ? "Midterm"
    : type === "endterm"
    ? "Endterm"
    : examType
}

interface BaseRepeatedQuestion {
  frequency: number
  questions: {
    question: string
    year: string
    examType: string
  }[]
}

interface ConceptBasedQuestion extends BaseRepeatedQuestion {
  concept: string
}

interface PatternBasedQuestion extends BaseRepeatedQuestion {
  pattern: string
}

interface RepeatedQuestions {
  conceptBased: ConceptBasedQuestion[]
  patternBased: PatternBasedQuestion[]
}

interface Unit {
  _id: string
  number: number
  topics: string[]
  repeatedQuestions?: RepeatedQuestions
  formulaSheet?: {
    content: string
    createdAt: string
    updatedAt: string
  }
}

interface Question {
  _id: string
  question: string
  marks: number
  year: number
  topics: string[]
  unit: number
  midsem: boolean
}

interface Subject {
  _id: string
  name: string
  semester: number
  code?: string
  credits?: number
}

interface Contributor {
  name: string
  branch: string
  semester: number
  avatar: string
  linkedinUrl?: string
  subject_ids: {
    _id: string
    name: string
  }[]
}

type ViewMode = "units" | "yearwise" | "repeated"
type ExamFilter = "all" | "midterm" | "endterm"
type RepeatedType = "concept" | "pattern"

export default function UnitsPage() {
  const params = useParams()
  const { branchId, semId, subjectId } = params
  const { theme } = useTheme()
  const isLight = theme === "light"
  const [units, setUnits] = useState<Unit[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("units")
  const [examFilter, setExamFilter] = useState<ExamFilter>("all")
  const [repeatedType, setRepeatedType] = useState<RepeatedType>("concept")
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {}
  )
  const [expandedUnits, setExpandedUnits] = useState<Record<number, boolean>>(
    {}
  )
  const [showFormulaSheetModal, setShowFormulaSheetModal] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const { getContributorBySubjectId } = useContributors()
  const [contributor, setContributor] = useState<Contributor | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, subjectResponse, questionsResponse] =
          await Promise.all([
            axios.get(`/api/units?subject_id=${subjectId}`),
            axios.get(`/api/subjects/${subjectId}`),
            axios.get(`/api/questions/subject/${subjectId}`),
          ])

        const [unitsData, subjectData, questionsData] = [
          unitsResponse.data,
          subjectResponse.data,
          questionsResponse.data,
        ]

        setUnits(unitsData.units)
        setSubject(subjectData.subject)
        setQuestions(questionsData.foundQuestions || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (subjectId) {
      fetchData()
    }
  }, [subjectId])

  // Get contributor from context
  useEffect(() => {
    if (subjectId) {
      const subjectContributor = getContributorBySubjectId(subjectId as string)
      setContributor(subjectContributor)
    }
  }, [subjectId, getContributorBySubjectId])

  // Filter questions based on exam type
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (examFilter === "all") return true
      if (examFilter === "midterm") return question.midsem
      return !question.midsem // endterm
    })
  }, [questions, examFilter])

  // Group filtered questions by year and unit
  const questionsByYear = useMemo(() => {
    return filteredQuestions.reduce((acc, question) => {
      const year = question.year
      if (!acc[year]) {
        acc[year] = {
          total: 0,
          byUnit: {} as Record<number, Question[]>,
        }
      }
      if (!acc[year].byUnit[question.unit]) {
        acc[year].byUnit[question.unit] = []
      }
      acc[year].byUnit[question.unit].push(question)
      acc[year].total++
      return acc
    }, {} as Record<number, { total: number; byUnit: Record<number, Question[]> }>)
  }, [filteredQuestions])

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(questionsByYear)
      .map(Number)
      .sort((a, b) => b - a)
  }, [questionsByYear])

  // Toggle year expansion
  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

  // Toggle unit expansion in repeated questions
  const toggleUnit = (unitNumber: number) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitNumber]: !prev[unitNumber],
    }))
  }

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || ""
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || ""

  // Get total questions count for the current filter
  const totalFilteredQuestions = filteredQuestions.length

  // Pluralize years correctly
  const yearText = sortedYears.length === 1 ? "year" : "years"

  return (
    <PageWrapper>
      <div className="relative min-h-screen flex flex-col sm:h-screen overflow-auto sm:overflow-hidden">
        <div className="z-20 bg-inherit sm:sticky sm:top-0">
          <Header
            branchId={parsedBranchId}
            semId={parsedSemId}
            backLink={`/branch/${parsedBranchId}/semester/${parsedSemId}`}
            backText="Back to Subjects"
            title={subject?.name || "Loading..."}
            subtitle={
              viewMode === "units"
                ? `${units.length} units to explore`
                : `${totalFilteredQuestions} questions across ${sortedYears.length} ${yearText}`
            }
            stats={{
              primary: {
                value: viewMode === "units" ? units.length : sortedYears.length,
                label: viewMode === "units" ? "Units" : yearText,
              },
              secondary: {
                value:
                  viewMode === "units"
                    ? units.reduce((acc, unit) => acc + unit.topics.length, 0)
                    : totalFilteredQuestions,
                label: viewMode === "units" ? "Topics" : "Questions",
              },
            }}
            contributor={contributor}
          />
        </div>

        <div
          className={`flex-1 flex flex-col sm:overflow-hidden ${
            isLight
              ? "bg-white sm:bg-[#F8F8F8]"
              : "bg-gradient-to-b from-gray-950 to-black sm:bg-[#121212]"
          }`}
        >
          <div
            className={`h-full sm:overflow-y-auto sm:flex-1 scrollbar-thin scrollbar-thumb-rounded-full ${
              isLight
                ? "scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/60"
                : "scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50"
            }`}
          >
            <div className="p-3 sm:p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading content..." />
              ) : (
                <>
                  <div className="mb-4 sm:mb-8">
                    <div
                      className={`max-w-xl mx-auto ${
                        isLight
                          ? "bg-white border-black"
                          : "bg-[#1E1E1E] border-white"
                      } border-4 p-1.5 sm:p-2`}
                    >
                      <div className="flex flex-row">
                        <button
                          onClick={() => setViewMode("units")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                            viewMode === "units"
                              ? isLight
                                ? "bg-[#76ABAE] text-black border-black"
                                : "bg-[#4ECDC4] text-[#121212] border-white"
                              : isLight
                              ? "bg-white text-black border-black"
                              : "bg-[#1E1E1E] text-white border-white"
                          }`}
                        >
                          <BookOpen className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                            Unit-wise
                          </span>
                        </button>
                        <button
                          onClick={() => setViewMode("yearwise")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                            viewMode === "yearwise"
                              ? isLight
                                ? "bg-[#FFD56B] text-black border-black"
                                : "bg-[#FFE66D] text-[#121212] border-white"
                              : isLight
                              ? "bg-white text-black border-black"
                              : "bg-[#1E1E1E] text-white border-white"
                          }`}
                        >
                          <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                            Year-wise
                          </span>
                        </button>
                        <button
                          onClick={() => setViewMode("repeated")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                            viewMode === "repeated"
                              ? isLight
                                ? "bg-[#FF7B54] text-black border-black"
                                : "bg-[#FF6B6B] text-[#121212] border-white"
                              : isLight
                              ? "bg-white text-black border-black"
                              : "bg-[#1E1E1E] text-white border-white"
                          }`}
                        >
                          <Repeat className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                          <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                            Repeated
                          </span>
                        </button>
                      </div>
                    </div>

                    {viewMode === "yearwise" && (
                      <div
                        className={`mt-4 sm:mt-6 max-w-xl mx-auto ${
                          isLight
                            ? "bg-white border-black"
                            : "bg-[#1E1E1E] border-white"
                        } border-4 p-1.5 sm:p-2`}
                      >
                        <div className="flex flex-row">
                          <button
                            onClick={() => setExamFilter("all")}
                            className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                              examFilter === "all"
                                ? isLight
                                  ? "bg-[#76ABAE] text-black border-black"
                                  : "bg-[#4ECDC4] text-[#121212] border-white"
                                : isLight
                                ? "bg-white text-black border-black"
                                : "bg-[#1E1E1E] text-white border-white"
                            }`}
                          >
                            <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                              All Exams
                            </span>
                          </button>
                          <button
                            onClick={() => setExamFilter("midterm")}
                            className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                              examFilter === "midterm"
                                ? isLight
                                  ? "bg-[#FFD56B] text-black border-black"
                                  : "bg-[#FFE66D] text-[#121212] border-white"
                                : isLight
                                ? "bg-white text-black border-black"
                                : "bg-[#1E1E1E] text-white border-white"
                            }`}
                          >
                            <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                              <span className="hidden sm:inline">Midterm</span>
                              <span className="sm:hidden">Mid</span>
                            </span>
                          </button>
                          <button
                            onClick={() => setExamFilter("endterm")}
                            className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                              examFilter === "endterm"
                                ? isLight
                                  ? "bg-[#FF7B54] text-black border-black"
                                  : "bg-[#FF6B6B] text-[#121212] border-white"
                                : isLight
                                ? "bg-white text-black border-black"
                                : "bg-[#1E1E1E] text-white border-white"
                            }`}
                          >
                            <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                              <span className="hidden sm:inline">Endterm</span>
                              <span className="sm:hidden">End</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {viewMode === "repeated" && (
                      <div
                        className={`mt-4 sm:mt-6 max-w-xl mx-auto ${
                          isLight
                            ? "bg-white border-black"
                            : "bg-[#1E1E1E] border-white"
                        } border-4 p-1.5 sm:p-2`}
                      >
                        <div className="flex flex-row">
                          <button
                            onClick={() => setRepeatedType("concept")}
                            className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                              repeatedType === "concept"
                                ? isLight
                                  ? "bg-[#76ABAE] text-black border-black"
                                  : "bg-[#4ECDC4] text-[#121212] border-white"
                                : isLight
                                ? "bg-white text-black border-black"
                                : "bg-[#1E1E1E] text-white border-white"
                            }`}
                          >
                            <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                              Concept Based
                            </span>
                          </button>
                          <button
                            onClick={() => setRepeatedType("pattern")}
                            className={`flex-1 flex items-center justify-center px-2 sm:px-6 py-2 sm:py-3 border-2 m-0.5 transition-all ${
                              repeatedType === "pattern"
                                ? isLight
                                  ? "bg-[#FFD56B] text-black border-black"
                                  : "bg-[#FFE66D] text-[#121212] border-white"
                                : isLight
                                ? "bg-white text-black border-black"
                                : "bg-[#1E1E1E] text-white border-white"
                            }`}
                          >
                            <span className="text-xs sm:text-base font-bold whitespace-nowrap">
                              Pattern Based
                            </span>
                          </button>
                        </div>
                      </div>
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
                          [...units]
                            .sort((a, b) => a.number - b.number)
                            .map((unit: Unit, index: number) => (
                              <UnitCard
                                key={unit._id}
                                unit={unit}
                                index={index}
                                branchId={parsedBranchId}
                                semId={parsedSemId}
                                subjectId={subjectId as string}
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
                      <motion.div
                        key="yearwise"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto space-y-6"
                      >
                        {sortedYears.length > 0 ? (
                          sortedYears.map((year) => (
                            <div
                              key={year}
                              className={`${
                                isLight
                                  ? "bg-white border-black"
                                  : "bg-[#1E1E1E] border-white"
                              } border-4 overflow-hidden`}
                            >
                              <button
                                onClick={() => toggleYear(year)}
                                className={`w-full px-3 sm:px-8 py-3 sm:py-5 flex items-center justify-between ${
                                  isLight ? "border-black" : "border-white"
                                } border-b-4 transition-colors`}
                              >
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 ${
                                      isLight
                                        ? "bg-[#76ABAE] border-black"
                                        : "bg-[#4ECDC4] border-white"
                                    } border-3 flex items-center justify-center`}
                                  >
                                    <Calendar
                                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                        isLight
                                          ? "text-black"
                                          : "text-[#121212]"
                                      }`}
                                    />
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                                    <h2
                                      className={`text-xl sm:text-2xl font-bold ${
                                        isLight
                                          ? "text-[#2D2A32]"
                                          : "text-gray-200"
                                      }`}
                                    >
                                      {year}
                                    </h2>
                                    <span
                                      className={`text-xs sm:text-sm px-2 sm:px-2.5 py-0.5 sm:py-1 border-2 ${
                                        isLight
                                          ? "bg-[#FFD56B] text-black border-black"
                                          : "bg-[#FFE66D] text-[#121212] border-white"
                                      }`}
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
                                  className={`w-5 h-5 ${
                                    isLight ? "text-[#2D2A32]" : "text-gray-200"
                                  } ${expandedYears[year] ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence>
                                {expandedYears[year] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`${
                                      isLight ? "border-t-0" : "border-t-0"
                                    }`}
                                  >
                                    <div className="px-3 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
                                      {Object.entries(
                                        questionsByYear[year].byUnit
                                      )
                                        .sort(
                                          ([a], [b]) => Number(a) - Number(b)
                                        )
                                        .map(([unit, questions]) => (
                                          <div key={unit}>
                                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                              <div
                                                className={`w-6 h-6 sm:w-8 sm:h-8 ${
                                                  isLight
                                                    ? "bg-[#76ABAE] border-black"
                                                    : "bg-[#4ECDC4] border-white"
                                                } border-2 flex items-center justify-center`}
                                              >
                                                <BookOpen
                                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                                    isLight
                                                      ? "text-black"
                                                      : "text-[#121212]"
                                                  }`}
                                                />
                                              </div>
                                              <h3
                                                className={`text-base sm:text-lg font-bold ${
                                                  isLight
                                                    ? "text-[#2D2A32]"
                                                    : "text-gray-200"
                                                }`}
                                              >
                                                Unit {unit}
                                              </h3>
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                              {questions.map((question) => (
                                                <div
                                                  key={question._id}
                                                  className={`${
                                                    isLight
                                                      ? "bg-white border-black"
                                                      : "bg-[#1E1E1E] border-white"
                                                  } border-2 p-3 sm:p-4`}
                                                >
                                                  <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                      <div className="flex gap-2 items-start mb-2">
                                                        <div
                                                          className={`px-1.5 py-0.5 text-xs border-2 text-black ${
                                                            isLight
                                                              ? question.midsem
                                                                ? "bg-[#FFD56B] border-black"
                                                                : "bg-[#FF7B54] border-black"
                                                              : question.midsem
                                                              ? "bg-[#FFE66D] border-white"
                                                              : "bg-[#FF6B6B] border-white"
                                                          }`}
                                                        >
                                                          {question.midsem
                                                            ? "Midterm"
                                                            : "Endterm"}
                                                        </div>
                                                        <div
                                                          className={`px-1.5 py-0.5 text-black text-xs border-2 ${
                                                            isLight
                                                              ? "bg-[#76ABAE] border-black"
                                                              : "bg-[#4ECDC4] border-white"
                                                          }`}
                                                        >
                                                          {question.marks} marks
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={`text-sm sm:text-base prose ${
                                                          isLight
                                                            ? "prose-black"
                                                            : "prose-invert"
                                                        } max-w-none ${
                                                          isLight
                                                            ? "light-katex"
                                                            : ""
                                                        } ${
                                                          isLight
                                                            ? "text-[#2D2A32]"
                                                            : "text-gray-200"
                                                        }`}
                                                      >
                                                        <ReactMarkdown
                                                          remarkPlugins={[
                                                            remarkGfm,
                                                            remarkMath,
                                                          ]}
                                                          rehypePlugins={[
                                                            [
                                                              rehypeKatex,
                                                              {
                                                                throwOnError:
                                                                  false,
                                                                strict: false,
                                                              },
                                                            ],
                                                          ]}
                                                        >
                                                          {question.question}
                                                        </ReactMarkdown>
                                                      </div>
                                                      <div className="flex flex-wrap gap-1 mt-2">
                                                        {question.topics.map(
                                                          (topic, i) => (
                                                            <span
                                                              key={i}
                                                              className={`text-xs px-1.5 py-0.5 inline-flex items-center ${
                                                                isLight
                                                                  ? "bg-gray-100 text-gray-800 border-gray-400"
                                                                  : "bg-gray-800 text-gray-200 border-gray-600"
                                                              } border`}
                                                            >
                                                              {topic}
                                                            </span>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        ) : (
                          <EmptyState
                            icon={Calendar}
                            title="No Questions Available"
                            description={
                              examFilter !== "all"
                                ? `No ${examFilter} questions found. Try selecting 'All Exams'.`
                                : "No questions available for this subject yet."
                            }
                          />
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="repeated"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto space-y-6"
                      >
                        {units.length > 0 &&
                        units.some(
                          (unit) =>
                            unit.repeatedQuestions &&
                            ((repeatedType === "concept" &&
                              unit.repeatedQuestions.conceptBased.length > 0) ||
                              (repeatedType === "pattern" &&
                                unit.repeatedQuestions.patternBased.length > 0))
                        ) ? (
                          units
                            .filter(
                              (unit) =>
                                unit.repeatedQuestions &&
                                ((repeatedType === "concept" &&
                                  unit.repeatedQuestions.conceptBased.length >
                                    0) ||
                                  (repeatedType === "pattern" &&
                                    unit.repeatedQuestions.patternBased.length >
                                      0))
                            )
                            .sort((a, b) => a.number - b.number)
                            .map((unit) => (
                              <div
                                key={unit._id}
                                className={`${
                                  isLight
                                    ? "bg-white border-black"
                                    : "bg-[#1E1E1E] border-white"
                                } border-4 overflow-hidden`}
                              >
                                <button
                                  onClick={() => toggleUnit(unit.number)}
                                  className={`w-full p-4 sm:p-6 border-b-4 ${
                                    isLight ? "border-black" : "border-white"
                                  } transition-colors flex items-center justify-between`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 ${
                                        isLight
                                          ? "bg-[#76ABAE] border-black"
                                          : "bg-[#4ECDC4] border-white"
                                      } border-3 flex items-center justify-center`}
                                    >
                                      <BookOpen
                                        className={`w-5 h-5 ${
                                          isLight
                                            ? "text-black"
                                            : "text-[#121212]"
                                        }`}
                                      />
                                    </div>
                                    <h2
                                      className={`text-xl font-bold ${
                                        isLight
                                          ? "text-[#2D2A32]"
                                          : "text-gray-200"
                                      }`}
                                    >
                                      Unit {unit.number} - Repeated Questions
                                    </h2>
                                  </div>
                                  <ChevronDown
                                    className={`w-5 h-5 ${
                                      isLight ? "text-[#2D2A32]" : "text-gray-200"
                                    } transition-transform ${
                                      expandedUnits[unit.number] ? "rotate-180" : ""
                                    }`}
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
                                    <div className="space-y-4">
                                      {unit.repeatedQuestions?.conceptBased.map(
                                        (concept, i) => (
                                          <div
                                            key={`concept-${i}`}
                                            className={`${
                                              isLight
                                                ? "bg-[#F5F5F5] border-black"
                                                : "bg-[#252525] border-white"
                                            } border-2 p-4`}
                                          >
                                            <div className="mb-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <h3
                                                  className={`text-lg font-bold ${
                                                    isLight
                                                      ? "text-[#2D2A32]"
                                                      : "text-gray-200"
                                                  }`}
                                                >
                                                  {concept.concept}
                                                </h3>
                                                <span
                                                  className={`inline-flex items-center text-sm px-2 py-1 border-2 ${
                                                    isLight
                                                      ? "bg-[#FFD56B] border-black"
                                                      : "bg-[#FFE66D] text-[#121212] border-white"
                                                  }`}
                                                >
                                                  {concept.frequency}x frequent
                                                </span>
                                              </div>

                                              <div className="space-y-3 mt-4">
                                                {concept.questions.map(
                                                  (question, j) => (
                                                    <div
                                                      key={`concept-q-${j}`}
                                                      className={`p-3 ${
                                                        isLight
                                                          ? "bg-white border-black"
                                                          : "bg-[#1E1E1E] border-white"
                                                      } border-2`}
                                                    >
                                                      <div className="flex gap-2 items-start mb-2">
                                                        <div
                                                          className={`px-2 py-0.5 text-xs border-2 ${
                                                            isLight
                                                              ? "bg-[#76ABAE] border-black"
                                                              : "bg-[#4ECDC4] text-[#121212] border-white"
                                                          }`}
                                                        >
                                                          {question.year}
                                                        </div>
                                                        <div
                                                          className={`px-2 py-0.5 text-xs border-2 ${
                                                            isLight
                                                              ? formatExamType(
                                                                  question.examType
                                                                ) === "Midterm"
                                                                ? "bg-[#FFD56B] border-black"
                                                                : "bg-[#FF7B54] border-black"
                                                              : formatExamType(
                                                                  question.examType
                                                                ) === "Midterm"
                                                              ? "bg-[#FFE66D] text-[#121212] border-white"
                                                              : "bg-[#FF6B6B] text-[#121212] border-white"
                                                          }`}
                                                        >
                                                          {formatExamType(
                                                            question.examType
                                                          )}
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={`text-sm sm:text-base prose ${
                                                          isLight
                                                            ? "prose-black"
                                                            : "prose-invert"
                                                        } max-w-none ${
                                                          isLight
                                                            ? "light-katex"
                                                            : ""
                                                        } ${
                                                          isLight
                                                            ? "text-[#2D2A32]"
                                                            : "text-gray-200"
                                                        }`}
                                                      >
                                                        <ReactMarkdown
                                                          remarkPlugins={[
                                                            remarkGfm,
                                                            remarkMath,
                                                          ]}
                                                          rehypePlugins={[
                                                            [
                                                              rehypeKatex,
                                                              {
                                                                throwOnError:
                                                                  false,
                                                                strict: false,
                                                              },
                                                            ],
                                                          ]}
                                                        >
                                                          {question.question}
                                                        </ReactMarkdown>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      {unit.repeatedQuestions?.patternBased.map(
                                        (pattern, i) => (
                                          <div
                                            key={`pattern-${i}`}
                                            className={`${
                                              isLight
                                                ? "bg-[#F5F5F5] border-black"
                                                : "bg-[#252525] border-white"
                                            } border-2 p-4`}
                                          >
                                            <div className="mb-3">
                                              <div className="flex items-center justify-between mb-2">
                                                <h3
                                                  className={`text-lg font-bold ${
                                                    isLight
                                                      ? "text-[#2D2A32]"
                                                      : "text-gray-200"
                                                  }`}
                                                >
                                                  {pattern.pattern}
                                                </h3>
                                                <span
                                                  className={`inline-flex items-center text-sm px-2 py-1 border-2 ${
                                                    isLight
                                                      ? "bg-[#FFD56B] border-black"
                                                      : "bg-[#FFE66D] text-[#121212] border-white"
                                                  }`}
                                                >
                                                  {pattern.frequency}x frequent
                                                </span>
                                              </div>

                                              <div className="space-y-3 mt-4">
                                                {pattern.questions.map(
                                                  (question, j) => (
                                                    <div
                                                      key={`pattern-q-${j}`}
                                                      className={`p-3 ${
                                                        isLight
                                                          ? "bg-white border-black"
                                                          : "bg-[#1E1E1E] border-white"
                                                      } border-2`}
                                                    >
                                                      <div className="flex gap-2 items-start mb-2">
                                                        <div
                                                          className={`px-2 py-0.5 text-xs border-2 ${
                                                            isLight
                                                              ? "bg-[#76ABAE] border-black"
                                                              : "bg-[#4ECDC4] text-[#121212] border-white"
                                                          }`}
                                                        >
                                                          {question.year}
                                                        </div>
                                                        <div
                                                          className={`px-2 py-0.5 text-xs border-2 ${
                                                            isLight
                                                              ? formatExamType(
                                                                  question.examType
                                                                ) === "Midterm"
                                                                ? "bg-[#FFD56B] border-black"
                                                                : "bg-[#FF7B54] border-black"
                                                              : formatExamType(
                                                                  question.examType
                                                                ) === "Midterm"
                                                              ? "bg-[#FFE66D] text-[#121212] border-white"
                                                              : "bg-[#FF6B6B] text-[#121212] border-white"
                                                          }`}
                                                        >
                                                          {formatExamType(
                                                            question.examType
                                                          )}
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={`text-sm sm:text-base prose ${
                                                          isLight
                                                            ? "prose-black"
                                                            : "prose-invert"
                                                        } max-w-none ${
                                                          isLight
                                                            ? "light-katex"
                                                            : ""
                                                        } ${
                                                          isLight
                                                            ? "text-[#2D2A32]"
                                                            : "text-gray-200"
                                                        }`}
                                                      >
                                                        <ReactMarkdown
                                                          remarkPlugins={[
                                                            remarkGfm,
                                                            remarkMath,
                                                          ]}
                                                          rehypePlugins={[
                                                            [
                                                              rehypeKatex,
                                                              {
                                                                throwOnError:
                                                                  false,
                                                                strict: false,
                                                              },
                                                            ],
                                                          ]}
                                                        >
                                                          {question.question}
                                                        </ReactMarkdown>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  )}
                                </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                              </div>
                            ))
                        ) : (
                          <div className="col-span-full">
                            <EmptyState
                              icon={Repeat}
                              title="No Repeated Questions"
                              description={`There are no repeated ${
                                repeatedType === "concept"
                                  ? "concept-based"
                                  : "pattern-based"
                              } questions available for this subject yet.`}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        <FormulaSheetModal
          isOpen={showFormulaSheetModal}
          onClose={() => {
            setShowFormulaSheetModal(false)
            setSelectedUnit(null)
          }}
          formulaSheet={selectedUnit?.formulaSheet || null}
          unitNumber={selectedUnit?.number || 0}
        />
      </div>
    </PageWrapper>
  )
}
