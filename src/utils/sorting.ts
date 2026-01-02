import { SortOrder } from "@/types"

/**
 * Sort by number property (ascending or descending)
 */
export function sortByNumber<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T,
  order: SortOrder = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[key] as number
    const bVal = b[key] as number
    return order === "asc" ? aVal - bVal : bVal - aVal
  })
}

/**
 * Sort by string property (alphabetically)
 */
export function sortByString<T extends Record<string, unknown>>(
  items: T[],
  key: keyof T,
  order: SortOrder = "asc"
): T[] {
  return [...items].sort((a, b) => {
    const aVal = String(a[key])
    const bVal = String(b[key])
    const comparison = aVal.localeCompare(bVal)
    return order === "asc" ? comparison : -comparison
  })
}

/**
 * Sort years in descending order (newest first)
 */
export function sortYearsDescending(years: number[]): number[] {
  return [...years].sort((a, b) => b - a)
}

/**
 * Sort years in ascending order (oldest first)
 */
export function sortYearsAscending(years: number[]): number[] {
  return [...years].sort((a, b) => a - b)
}

/**
 * Sort subjects by name alphabetically
 */
export function sortSubjectsByName<T extends { name: string }>(
  subjects: T[]
): T[] {
  return [...subjects].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Sort units by unit number
 */
export function sortUnitsByNumber<T extends { number: number }>(
  units: T[]
): T[] {
  return [...units].sort((a, b) => a.number - b.number)
}

/**
 * Sort topics by weightage (highest first by default)
 */
export function sortTopicsByWeightage<T extends object>(
  topics: T[],
  field: string = "weightage",
  order: "asc" | "desc" = "desc"
): T[] {
  return [...topics].sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[field] as number
    const bValue = (b as Record<string, unknown>)[field] as number
    const diff = bValue - aValue
    return order === "desc" ? diff : -diff
  })
}

/**
 * Sort topics by questions count (highest first)
 */
export function sortTopicsByQuestionCount<T extends { questions: unknown[] }>(
  topics: T[]
): T[] {
  return [...topics].sort((a, b) => b.questions.length - a.questions.length)
}
