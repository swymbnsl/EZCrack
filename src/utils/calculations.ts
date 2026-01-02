/**
 * Calculate sum of numeric values in an array
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0)
}

/**
 * Calculate sum of a specific property from array of objects
 */
export function sumBy<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): number {
  return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)
}

/**
 * Calculate average of numeric values
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0
  return sum(values) / values.length
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Round a number to specified decimal places
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Calculate total questions count from units
 */
export function calculateTotalQuestions<
  T extends { topics: { questions: unknown[] }[] }
>(units: T[]): number {
  return units.reduce(
    (total, unit) =>
      total +
      unit.topics.reduce(
        (topicTotal, topic) => topicTotal + topic.questions.length,
        0
      ),
    0
  )
}

/**
 * Calculate total marks from questions
 */
export function calculateTotalMarks<T extends { marks: number }>(
  questions: T[]
): number {
  return questions.reduce((total, q) => total + (q.marks || 0), 0)
}

/**
 * Calculate topic weightage based on frequency and marks
 * Formula: rawScore = totalMarks * frequency
 * Weightage = (rawScore / totalRawScore) * 100
 */
export function calculateWeightage(
  rawScore: number,
  totalRawScore: number
): number {
  if (totalRawScore === 0) return 0
  const exactWeightage = (rawScore / totalRawScore) * 100
  // Return at least 1% if there's any score
  return exactWeightage < 1 && exactWeightage > 0
    ? 1
    : Math.round(exactWeightage)
}

/**
 * Normalize weightages to ensure they sum to 100
 * Distributes any remainder to highest-weighted items
 */
export function normalizeWeightages<
  T extends { weightage: number; exactWeightage: number }
>(items: T[]): T[] {
  const result = [...items]
  const currentSum = sumBy(result, "weightage")

  if (currentSum === 100) return result

  const sortedByExact = [...result]
    .filter((item) => item.weightage > 0)
    .sort((a, b) => b.exactWeightage - a.exactWeightage)

  let remaining = 100 - currentSum

  for (let i = 0; i < sortedByExact.length && remaining !== 0; i++) {
    const adjustment = remaining > 0 ? 1 : -1
    const originalItem = result.find(
      (item) => item.exactWeightage === sortedByExact[i].exactWeightage
    )
    if (originalItem) {
      originalItem.weightage += adjustment
      remaining -= adjustment
    }
  }

  return result
}

/**
 * Count unique values in an array
 */
export function countUnique<T>(items: T[]): number {
  return new Set(items).size
}

/**
 * Get unique values from an array
 */
export function getUnique<T>(items: T[]): T[] {
  return [...new Set(items)]
}

/**
 * Get unique years from questions
 */
export function getUniqueYears<T extends { year: number }>(
  items: T[]
): number[] {
  return [...new Set(items.map((item) => item.year))].sort((a, b) => b - a)
}

/**
 * Generate analysis data for unit topics with weightage calculations
 * Calculates weightage based on question frequency and marks
 */
export function generateTopicAnalysis<
  RawUnit extends { topics: string[]; [key: string]: unknown },
  RawQuestion extends {
    _id: string
    question: string
    marks: number
    year: number
    midsem: boolean
    answer?: string
    topics?: string[]
  }
>(
  rawUnit: RawUnit,
  questions: RawQuestion[]
): RawUnit & {
  topics: Array<{
    title: string
    rawScore: number
    years: number[]
    weightage: number
    questions: Array<{
      id: string
      text: string
      marks: number
      year: number
      midsem: boolean
      answer?: string
    }>
  }>
} {
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
        (q) => q.topics && q.topics.includes(topic)
      )
      const years = [...new Set(topicQuestions.map((q) => q.year))]
      const totalMarks = topicQuestions.reduce(
        (sum: number, q) => sum + (q.marks || 0),
        0
      )
      const frequency = topicQuestions.length
      const rawScore = frequency > 0 ? totalMarks * frequency : 0

      return {
        title: topic,
        rawScore,
        years,
        questions: topicQuestions.map((q) => ({
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
    (sum: number, topic) => sum + topic.rawScore,
    0
  )

  const topicsWithWeightage = topicsWithRawScores.map((topic) => {
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
  })

  // Normalize to 100%
  if (topicsWithQuestions.length > 0) {
    const weightageSum = topicsWithWeightage.reduce(
      (sum, topic) => sum + topic.weightage,
      0
    )

    if (weightageSum !== 100) {
      const sortedTopics = [...topicsWithWeightage]
        .filter((t) => t.questions.length > 0)
        .sort((a, b) => b.exactWeightage - a.exactWeightage)

      let remaining = 100 - weightageSum

      for (let i = 0; i < sortedTopics.length && remaining !== 0; i++) {
        const adjustment = remaining > 0 ? 1 : -1
        const index = topicsWithWeightage.findIndex(
          (t) => t.title === sortedTopics[i].title
        )

        topicsWithWeightage[index].weightage += adjustment
        remaining -= adjustment
      }
    }
  }

  return {
    ...rawUnit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    topics: topicsWithWeightage.map(({ exactWeightage, ...topic }) => topic),
  } as RawUnit & {
    topics: Array<{
      title: string
      rawScore: number
      years: number[]
      weightage: number
      questions: Array<{
        id: string
        text: string
        marks: number
        year: number
        midsem: boolean
        answer?: string
      }>
    }>
  }
}
