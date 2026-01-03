import { useState, useEffect, useMemo, useCallback } from "react"
import { useContributors } from "@/contexts/ContributorsContext"
import { subjectsApi, unitsApi, questionsApi } from "@/services/api"
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

interface UseSubjectDataProps {
  subjectId: string
}

interface QuestionsByYear {
  total: number
  byUnit: Record<number, Question[]>
}

export function useSubjectData({ subjectId }: UseSubjectDataProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contributor, setContributor] = useState<Contributor | undefined>(
    undefined
  )

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

  const { getContributorBySubjectId } = useContributors()

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, questionsResponse] =
          await Promise.all([
            unitsApi.getBySubjectId(subjectId),
            questionsApi.getBySubjectId(subjectId),
          ])

        setUnits(unitsResponse.units)
        const subjectData = unitsResponse.units[0].subject_id
        if (subjectData && typeof subjectData === 'object') {
          setSubject(subjectData)
        }


        setQuestions(questionsResponse.foundQuestions || [])
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

  // Fetch contributor
  useEffect(() => {
    if (subjectId) {
      const subjectContributor = getContributorBySubjectId(subjectId)
      setContributor(subjectContributor)
    }
  }, [subjectId, getContributorBySubjectId])

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

  return {
    // Data
    units,
    questions,
    subject,
    isLoading,
    contributor,

    // View state
    viewMode,
    setViewMode,
    examFilter,
    setExamFilter,
    repeatedType,
    setRepeatedType,

    // Computed data
    filteredQuestions,
    questionsByYear,
    sortedYears,
    totalTopics,
    stats,
    subtitle,

    // Expanded state
    expandedYears,
    toggleYear,
    expandedUnits,
    toggleUnit,

    // Answer modal state
    showAnswerModal,
    setShowAnswerModal,
    selectedAnswer,
    setSelectedAnswer,
  }
}
