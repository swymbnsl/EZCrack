/**
 * Utils Index - Barrel exports for all utility functions
 */

// Sorting utilities
export {
  sortByNumber,
  sortByString,
  sortYearsDescending,
  sortYearsAscending,
  sortSubjectsByName,
  sortUnitsByNumber,
  sortTopicsByWeightage,
  sortTopicsByQuestionCount,
} from "./sorting"

// Calculation utilities
export {
  sum,
  sumBy,
  average,
  percentage,
  roundTo,
  calculateTotalQuestions,
  calculateTotalMarks,
  calculateWeightage,
  normalizeWeightages,
  countUnique,
  getUnique,
  getUniqueYears,
  generateTopicAnalysis,
} from "./calculations"

// Filtering utilities
export {
  filterByExamType,
  filterByYear,
  filterByYearRange,
  filterTopicsByYear,
  filterTopicsWithQuestions,
  filterBySearchQuery,
  filterByTopic,
  filterNonNull,
} from "./filtering"

// Formatting utilities
export {
  formatPercentage,
  formatMarks,
  formatYear,
  formatSemester,
  formatUnitNumber,
  formatTopicCount,
  formatQuestionCount,
  pluralize,
  truncateText,
  capitalizeFirst,
  toTitleCase,
  formatBranchName,
  formatExamType,
  formatExamTypeShort,
} from "./formatting"

// Grouping utilities
export {
  groupBy,
  groupQuestionsByYear,
  groupQuestionsByExamType,
  groupQuestionsByTopic,
  chunkArray,
  getSortedGroupEntries,
} from "./grouping"

// Routing utilities
export { parseRouteParam, parseRouteParams, buildRoutePath } from "./routing"
