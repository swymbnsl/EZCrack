/**
 * Group items by a key
 */
export function groupBy<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Group questions by year
 */
export function groupQuestionsByYear<T extends { year: number }>(
  questions: T[]
): Record<number, T[]> {
  return questions.reduce((groups, question) => {
    const year = question.year
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(question)
    return groups
  }, {} as Record<number, T[]>)
}

/**
 * Group questions by exam type
 */
export function groupQuestionsByExamType<T extends { midsem: boolean }>(
  questions: T[]
): { midsem: T[]; endsem: T[] } {
  return {
    midsem: questions.filter((q) => q.midsem),
    endsem: questions.filter((q) => !q.midsem),
  }
}

/**
 * Group questions by topic
 */
export function groupQuestionsByTopic<T extends { topics?: string[] }>(
  questions: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {}

  questions.forEach((question) => {
    ;(question.topics || []).forEach((topic) => {
      if (!groups[topic]) {
        groups[topic] = []
      }
      groups[topic].push(question)
    })
  })

  return groups
}

/**
 * Group items into chunks of specified size
 */
export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * Convert grouped record to sorted entries
 */
export function getSortedGroupEntries<T>(
  groups: Record<string | number, T[]>,
  sortKey: "key" | "count" = "key",
  order: "asc" | "desc" = "asc"
): [string, T[]][] {
  const entries = Object.entries(groups)

  if (sortKey === "key") {
    entries.sort(([a], [b]) => {
      const comparison =
        isNaN(Number(a)) || isNaN(Number(b))
          ? a.localeCompare(b)
          : Number(a) - Number(b)
      return order === "asc" ? comparison : -comparison
    })
  } else {
    entries.sort(([, a], [, b]) => {
      const comparison = a.length - b.length
      return order === "asc" ? comparison : -comparison
    })
  }

  return entries
}
