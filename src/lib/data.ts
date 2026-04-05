import "server-only"
import { connectToDB } from "@/lib/mongoose"
import Branch from "@/models/branch-model"
import Subject from "@/models/subjects-model"
import Unit from "@/models/units-model"
import Question from "@/models/questions-model"
import RepeatedQuestionGroup from "@/models/repeated-question-group-model"
import { Contributor as ContributorModel } from "@/models/contributors-model"
import type {
  Subject as SubjectType,
  PopulatedUnit,
  Question as QuestionType,
  Contributor,
  RawUnit,
  RepeatedQuestions,
} from "@/types"

/**
 * Serialize Mongoose documents to plain JSON objects.
 * Strips Mongoose internals like __v, ObjectId wrappers, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serialize<T>(data: any): T {
  return JSON.parse(JSON.stringify(data)) as T
}

// ============ Branch Queries ============

interface BranchDoc {
  _id: string
  name: string
  subject_ids: string[]
}

/**
 * Get all branches from the database (for generateStaticParams)
 */
export async function getAllBranches(): Promise<BranchDoc[]> {
  await connectToDB()
  const branches = await Branch.find({}).lean()
  return serialize<BranchDoc[]>(branches)
}

// ============ Subject Queries ============

/**
 * Get subjects for a specific branch + semester combination
 */
export async function getSubjectsByBranchAndSemester(
  branch: string,
  semester: string
): Promise<SubjectType[]> {
  await connectToDB()

  const branchDoc = await Branch.findOne({ name: branch + semester })
    .populate({
      path: "subject_ids",
      select: "_id name subject_code credits",
    })
    .lean()

  if (!branchDoc) return []

  return serialize<SubjectType[]>(
    (branchDoc as unknown as { subject_ids: SubjectType[] }).subject_ids
  )
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(
  subjectId: string
): Promise<SubjectType | null> {
  await connectToDB()
  const subject = await Subject.findById(subjectId).lean()
  return subject ? serialize<SubjectType>(subject) : null
}

// ============ Unit Queries ============

/**
 * Type for a populated question from the database
 */
interface PopulatedQuestion {
  _id: string
  question: string
  year: number
  midsem: boolean
  answer?: string
  image_urls?: string[]
}

/**
 * Helper function to fetch and transform repeated questions for units
 */
async function getRepeatedQuestionsForUnits(
  unitIds: string[]
): Promise<Map<string, RepeatedQuestions>> {
  const repeatedGroups = await RepeatedQuestionGroup.find({
    unit_id: { $in: unitIds },
  })
    .populate("question_ids")
    .lean()

  const repeatedByUnit = new Map<string, RepeatedQuestions>()

  for (const group of repeatedGroups) {
    const unitId = String(group.unit_id)
    
    if (!repeatedByUnit.has(unitId)) {
      repeatedByUnit.set(unitId, {
        conceptBased: [],
        patternBased: [],
      })
    }

    const unitRepeated = repeatedByUnit.get(unitId)!
    
    // Transform question_ids to the expected format
    const questions = (group.question_ids || []).map((q: PopulatedQuestion) => ({
      question: q.question || "",
      year: String(q.year || ""),
      examType: q.midsem ? "Midterm" : "Endterm",
      answer: q.answer,
      image_urls: q.image_urls || [],
    }))

    if (group.type === "concept") {
      unitRepeated.conceptBased.push({
        concept: group.name,
        frequency: group.frequency,
        questions,
      })
    } else if (group.type === "pattern") {
      unitRepeated.patternBased.push({
        pattern: group.name,
        frequency: group.frequency,
        questions,
      })
    }
  }

  return repeatedByUnit
}

/**
 * Get all units for a subject (with populated subject_id and repeated questions)
 */
export async function getUnitsBySubjectId(
  subjectId: string
): Promise<PopulatedUnit[]> {
  await connectToDB()
  const units = await Unit.find({ subject_id: subjectId })
    .populate("subject_id")
    .lean()

  // Fetch repeated questions for all units
  const unitIds = units.map((u) => String(u._id))
  const repeatedByUnit = await getRepeatedQuestionsForUnits(unitIds)

  // Attach repeated questions to each unit
  const unitsWithRepeated = units.map((unit) => {
    const unitId = String(unit._id)
    const repeatedQuestions = repeatedByUnit.get(unitId)
    
    return {
      ...unit,
      repeatedQuestions,
    }
  })

  return serialize<PopulatedUnit[]>(unitsWithRepeated)
}

/**
 * Get a single unit by ID
 */
export async function getUnitById(
  unitId: string
): Promise<RawUnit | null> {
  await connectToDB()
  const unit = await Unit.findById(unitId).lean()
  
  if (!unit) return null

  // Fetch repeated questions for this unit
  const unitDoc = unit as { _id: unknown }
  const unitIdStr = String(unitDoc._id)
  const repeatedByUnit = await getRepeatedQuestionsForUnits([unitIdStr])
  const repeatedQuestions = repeatedByUnit.get(unitIdStr)

  return serialize<RawUnit>({
    ...unit,
    repeatedQuestions,
  })
}

/**
 * Get all units from the database (for generateStaticParams)
 */
export async function getAllUnits(): Promise<
  Array<{ _id: string; subject_id: { _id: string } | string }>
> {
  await connectToDB()
  const units = await Unit.find({}).populate("subject_id").lean()
  return serialize<Array<{ _id: string; subject_id: { _id: string } | string }>>(
    units
  )
}

// ============ Question Queries ============

/**
 * Get all questions for a subject
 */
export async function getQuestionsBySubjectId(
  subjectId: string
): Promise<QuestionType[]> {
  await connectToDB()
  const questions = await Question.find({ subject_id: subjectId }).lean()
  return serialize<QuestionType[]>(questions)
}

/**
 * Get questions by unit number and subject ID
 */
export async function getQuestionsByUnitAndSubject(
  unit: number,
  subjectId: string
): Promise<QuestionType[]> {
  await connectToDB()
  const questions = await Question.find({
    unit,
    subject_id: subjectId,
  }).lean()
  return serialize<QuestionType[]>(questions)
}

// ============ Contributor Queries ============

/**
 * Get all contributors with populated subject names
 */
export async function getAllContributors(): Promise<Contributor[]> {
  await connectToDB()
  const contributors = await ContributorModel.find({})
    .populate("subject_ids", "name")
    .sort({ subject_ids: -1 })
    .lean()
  return serialize<Contributor[]>(contributors)
}

/**
 * Find the contributor for a specific subject ID
 */
export function getContributorBySubjectId(
  subjectId: string,
  contributors: Contributor[]
): Contributor | undefined {
  return contributors.find((contributor) =>
    contributor.subject_ids.some(
      (subject) => String(subject._id) === String(subjectId)
    )
  )
}
