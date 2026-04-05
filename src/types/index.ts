// ============ Subject Types ============
export interface Subject {
  _id: string
  name: string
  unit_ids: string[]
  subject_code: string
  credits: number
}

// ============ Contributor Types ============
export interface ContributorSubject {
  _id: string
  name: string
}

export interface Contributor {
  _id?: string
  name: string
  branch: string
  semester: number
  avatar: string
  linkedinUrl?: string
  subject_ids: ContributorSubject[]
}

// ============ Question Types ============
export interface BaseQuestion {
  _id: string
  question: string
  marks: number
  year: number | string
  midsem: boolean
  answer?: string
  image_urls?: string[]
}

export interface Question extends BaseQuestion {
  topics: string[]
  unit: number
}

export interface TopicQuestion {
  id: string
  text: string
  marks: number
  year: number
  midsem: boolean
  answer?: string
  image_urls?: string[]
}

export interface RepeatedQuestionItem {
  question: string
  year: string
  examType: string
  answer?: string
  image_urls?: string[]
}

export interface BaseRepeatedQuestion {
  frequency: number
  questions: RepeatedQuestionItem[]
}

export interface ConceptBasedQuestion extends BaseRepeatedQuestion {
  concept: string
}

export interface PatternBasedQuestion extends BaseRepeatedQuestion {
  pattern: string
}

export interface RepeatedQuestions {
  conceptBased: ConceptBasedQuestion[]
  patternBased: PatternBasedQuestion[]
}

// ============ Unit Types ============
export interface Note {
  topic: string
  content: string
  createdAt: string
}

export interface FormulaSheet {
  content: string
  createdAt: string
  updatedAt: string
}

export interface Topic {
  title: string
  weightage: number
  questions: TopicQuestion[]
  years: number[]
}

export interface Unit {
  _id: string
  number: number
  topics: string[] | Topic[]
  subject_id?: string
  notes?: Note[]
  formulaSheet?: FormulaSheet
  repeatedQuestions?: RepeatedQuestions
}

export interface PopulatedUnit extends Omit<Unit, "subject_id"> {
  subject_id?: string | Subject
}

export interface UnitWithTopics extends Omit<Unit, "topics"> {
  topics: Topic[]
}

export interface RawUnit {
  topics: string[]
  number: number
  _id: string
  subject_id: string
  notes?: Note[]
  formulaSheet?: FormulaSheet
  repeatedQuestions?: RepeatedQuestions
}

// ============ Raw API Response Types ============
export interface RawQuestion {
  _id: string
  topics: string[]
  question: string
  marks: number
  year: number
  midsem: boolean
  answer?: string
  image_urls?: string[]
}

export interface QuestionsData {
  foundQuestions: RawQuestion[]
}

// ============ UI Types ============
export type ViewMode = "units" | "yearwise" | "repeated"
export type ExamFilter = "all" | "midterm" | "endterm"
export type ExamType = "midterm" | "endterm" | "Midterm" | "Endterm"
export type RepeatedType = "concept" | "pattern"
export type SortOrder = "asc" | "desc" | "original"
export type YearFilter = "all" | number
export type TabType = "topics" | "questions"

// ============ API Response Types ============
export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface SubjectsResponse {
  subjects: Subject[]
}

export interface SubjectResponse {
  subject: Subject
}

export interface UnitsResponse {
  units: PopulatedUnit[]
}

export interface UnitResponse {
  unit: RawUnit
}

export interface QuestionsResponse {
  foundQuestions: Question[]
}

export interface ContributorsResponse {
  contributors: Contributor[]
}

// ============ Header Types ============
export interface HeaderProps {
  branchId: string | string[]
  semId: string
  backLink: string
  backText: string
  title: string
  subtitle: string
  stats: {
    primary: { value: number | string; label: string }
    secondary: { value: number | string; label: string }
  }
  showContributor?: boolean
  showWeightageInfo?: boolean
  contributor?: Contributor
}

export interface StatCardProps {
  value: number | string
  label: string
}
