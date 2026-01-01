import { ExamFilter } from "@/types"

/**
 * Filter questions by exam type (midsem/endsem)
 */
export function filterByExamType<T extends { midsem: boolean }>(
  questions: T[],
  examFilter: ExamFilter
): T[] {
  if (examFilter === "all") return questions
  if (examFilter === "midterm") return questions.filter((q) => q.midsem)
  return questions.filter((q) => !q.midsem)
}

/**
 * Filter questions by year
 */
export function filterByYear<T extends { year: number }>(
  questions: T[],
  year: number | "all"
): T[] {
  if (year === "all") return questions
  return questions.filter((q) => q.year === year)
}

/**
 * Filter questions by year range
 */
export function filterByYearRange<T extends { year: number }>(
  questions: T[],
  startYear: number,
  endYear: number
): T[] {
  return questions.filter((q) => q.year >= startYear && q.year <= endYear)
}

/**
 * Filter topics by year availability
 */
export function filterTopicsByYear<T extends { years: number[] }>(
  topics: T[],
  year: number | "all"
): T[] {
  if (year === "all") return topics
  return topics.filter((topic) => topic.years.includes(year))
}

/**
 * Filter topics that have questions
 */
export function filterTopicsWithQuestions<T extends { questions: unknown[] }>(
  topics: T[]
): T[] {
  return topics.filter((topic) => topic.questions.length > 0)
}

/**
 * Filter items by search query
 */
export function filterBySearchQuery<T extends Record<string, unknown>>(
  items: T[],
  searchKey: keyof T,
  query: string
): T[] {
  if (!query.trim()) return items
  const lowerQuery = query.toLowerCase()
  return items.filter((item) =>
    String(item[searchKey]).toLowerCase().includes(lowerQuery)
  )
}

/**
 * Filter questions by topic
 */
export function filterByTopic<T extends { topics?: string[] }>(
  questions: T[],
  topic: string
): T[] {
  return questions.filter((q) => q.topics?.includes(topic))
}

/**
 * Filter items that are not null/undefined
 */
export function filterNonNull<T>(items: (T | null | undefined)[]): T[] {
  return items.filter((item): item is T => item != null)
}
