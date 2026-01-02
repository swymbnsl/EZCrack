import { useState, useEffect, useMemo, useCallback } from "react"
import { unitsApi, questionsApi } from "@/services/api"
import { useContributors } from "@/contexts/ContributorsContext"
import { sortYearsDescending, sortTopicsByWeightage } from "@/utils"
import type {
  Topic,
  Note,
  UnitWithTopics,
  RawUnit,
  RawQuestion,
  QuestionsData,
  Contributor,
  SortOrder,
  YearFilter,
  TabType,
} from "@/types"

interface UseUnitDataProps {
  unitId: string
  subjectId: string
}

interface UseUnitDataReturn {
  unit: UnitWithTopics | null
  isLoading: boolean
  contributor: Contributor | undefined
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  yearFilter: YearFilter
  setYearFilter: (filter: YearFilter) => void
  availableYears: number[]
  sortedTopics: Topic[]
  showNotesModal: boolean
  setShowNotesModal: (show: boolean) => void
  selectedTopicNotes: Note | null
  setSelectedTopicNotes: (note: Note | null) => void
  showFormulaSheetModal: boolean
  setShowFormulaSheetModal: (show: boolean) => void
  showAnswerModal: boolean
  setShowAnswerModal: (show: boolean) => void
  selectedAnswer: { question: string; answer: string } | null
  setSelectedAnswer: (
    answer: { question: string; answer: string } | null
  ) => void
  handleTopicClick: (topicTitle: string) => void
  hasTopicNotes: (topicTitle: string) => boolean
}

export function useUnitData({
  unitId,
  subjectId,
}: UseUnitDataProps): UseUnitDataReturn {
  const [unit, setUnit] = useState<UnitWithTopics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("topics")
  const [sortOrder, setSortOrder] = useState<SortOrder>("original")
  const [yearFilter, setYearFilter] = useState<YearFilter>("all")
  const [availableYears, setAvailableYears] = useState<number[]>([])
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
  const [contributor, setContributor] = useState<Contributor | undefined>(
    undefined
  )

  const { getContributorBySubjectId } = useContributors()

  const generateAnalysisData = useCallback(
    (rawUnit: RawUnit, questionsData: QuestionsData): UnitWithTopics => {
      const questions = questionsData.foundQuestions || []

      interface TopicWithRawScore {
        title: string
        rawScore: number
        years: number[]
        questions: Array<{
          id: string
          text: string
          marks: number
          year: number
          midsem: boolean
          answer?: string
        }>
      }

      const topicsWithRawScores: TopicWithRawScore[] = rawUnit.topics.map(
        (topic: string) => {
          const topicQuestions = questions.filter(
            (q: RawQuestion) => q.topics && q.topics.includes(topic)
          )
          const years = [
            ...new Set(topicQuestions.map((q: RawQuestion) => q.year)),
          ]
          const totalMarks = topicQuestions.reduce(
            (sum: number, q: RawQuestion) => sum + (q.marks || 0),
            0
          )
          const frequency = topicQuestions.length
          const rawScore = frequency > 0 ? totalMarks * frequency : 0

          return {
            title: topic,
            rawScore,
            years,
            questions: topicQuestions.map((q: RawQuestion) => ({
              id: q._id,
              text: q.question,
              marks: q.marks,
              year: q.year,
              midsem: q.midsem,
              answer: q.answer,
            })),
          }
        }
      )

      const topicsWithQuestions = topicsWithRawScores.filter(
        (topic) => topic.questions.length > 0
      )

      const totalRawScore = topicsWithQuestions.reduce(
        (sum: number, topic: TopicWithRawScore) => sum + topic.rawScore,
        0
      )

      const topicsWithWeightage = topicsWithRawScores.map(
        (topic: TopicWithRawScore) => {
          const hasQuestions = topic.questions.length > 0

          if (hasQuestions && totalRawScore === 0) {
            return {
              ...topic,
              weightage:
                topicsWithQuestions.length === 1
                  ? 100
                  : Math.floor(100 / topicsWithQuestions.length),
              exactWeightage: 100 / topicsWithQuestions.length,
            }
          }

          const exactWeightage = hasQuestions
            ? (topic.rawScore / totalRawScore) * 100
            : 0

          let weightage = 0
          if (hasQuestions) {
            weightage =
              exactWeightage < 1 && exactWeightage > 0
                ? 1
                : Math.round(exactWeightage)
          }

          return {
            ...topic,
            weightage,
            exactWeightage,
          }
        }
      )

      if (topicsWithQuestions.length > 0) {
        const weightageSum = topicsWithWeightage.reduce(
          (sum, topic) => sum + topic.weightage,
          0
        )

        if (weightageSum !== 100) {
          const sorted = sortTopicsByWeightage(
            topicsWithWeightage.filter((t) => t.questions.length > 0),
            "exactWeightage"
          )

          let remaining = 100 - weightageSum

          for (let i = 0; i < sorted.length && remaining !== 0; i++) {
            const adjustment = remaining > 0 ? 1 : -1
            const index = topicsWithWeightage.findIndex(
              (t) => t.title === sorted[i].title
            )

            topicsWithWeightage[index].weightage += adjustment
            remaining -= adjustment
          }
        }
      }

      return {
        ...rawUnit,
        topics: topicsWithWeightage.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ({ exactWeightage, ...topic }) => topic as Topic
        ),
      }
    },
    []
  )

  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const unitResponse = await unitsApi.getById(unitId)
        const questionsResponse = await questionsApi.getByUnitAndSubject(
          unitResponse.unit.number,
          subjectId
        )

        const questionsData: QuestionsData = {
          foundQuestions: questionsResponse.foundQuestions.map((q) => ({
            ...q,
            year: typeof q.year === "string" ? parseInt(q.year) : q.year,
          })) as RawQuestion[],
        }

        setUnit(generateAnalysisData(unitResponse.unit, questionsData))
      } catch (error) {
        console.error("Error fetching unit data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (unitId) {
      fetchUnitData()
    }
  }, [unitId, subjectId, generateAnalysisData])

  useEffect(() => {
    if (subjectId) {
      const subjectContributor = getContributorBySubjectId(subjectId)
      setContributor(subjectContributor)
    }
  }, [subjectId, getContributorBySubjectId])

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

  const uniqueYears = useMemo(() => {
    if (!unit) return []

    const years = new Set<number>()
    unit.topics.forEach((topic) => {
      topic.years.forEach((year) => years.add(year))
    })

    return sortYearsDescending(Array.from(years))
  }, [unit])

  useEffect(() => {
    if (unit) {
      setAvailableYears(uniqueYears)
    }
  }, [uniqueYears, unit])

  return {
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
    setSelectedTopicNotes,
    showFormulaSheetModal,
    setShowFormulaSheetModal,
    showAnswerModal,
    setShowAnswerModal,
    selectedAnswer,
    setSelectedAnswer,
    handleTopicClick,
    hasTopicNotes,
  }
}
