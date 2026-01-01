/**
 * Format a number as percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format marks display (e.g., "5 marks" or "5M")
 */
export function formatMarks(marks: number, short: boolean = false): string {
  if (short) return `${marks}M`
  return `${marks} mark${marks === 1 ? "" : "s"}`
}

/**
 * Format year display
 */
export function formatYear(year: number): string {
  return year.toString()
}

/**
 * Format semester display
 */
export function formatSemester(semester: number | string): string {
  return `Semester ${semester}`
}

/**
 * Format unit number display
 */
export function formatUnitNumber(unitNumber: number): string {
  return `Unit ${unitNumber}`
}

/**
 * Format topic count display
 */
export function formatTopicCount(count: number): string {
  return `${count} topic${count === 1 ? "" : "s"}`
}

/**
 * Format question count display
 */
export function formatQuestionCount(count: number): string {
  return `${count} question${count === 1 ? "" : "s"}`
}

/**
 * Pluralize a word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  const pluralForm = plural || `${singular}s`
  return count === 1 ? singular : pluralForm
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Convert string to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Format branch name (handle common abbreviations)
 */
export function formatBranchName(branch: string): string {
  const abbreviations: Record<string, string> = {
    cse: "Computer Science & Engineering",
    ece: "Electronics & Communication",
    eee: "Electrical & Electronics",
    it: "Information Technology",
    mech: "Mechanical Engineering",
    civil: "Civil Engineering",
    aids: "AI & Data Science",
    aiml: "AI & Machine Learning",
    cst: "Computer Science & Technology",
  }

  const lower = branch.toLowerCase()
  return abbreviations[lower] || branch
}

/**
 * Format exam type display
 */
export function formatExamType(isMidsem: boolean): string {
  return isMidsem ? "Midterm" : "Endterm"
}

/**
 * Format exam type short display
 */
export function formatExamTypeShort(isMidsem: boolean): string {
  return isMidsem ? "Mid" : "End"
}
