import { sortTopicsByWeightage } from "@/utils"
import type {
  Topic,
  RawUnit,
  RawQuestion,
  QuestionsData,
  UnitWithTopics,
} from "@/types"

/**
 * Server-side version of the topic analysis logic from useUnitData.
 * Computes weightage for each topic based on question frequency and marks.
 */
export function generateAnalysisData(
  rawUnit: RawUnit,
  questionsData: QuestionsData
): UnitWithTopics {
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
          image_urls: q.image_urls,
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
}
