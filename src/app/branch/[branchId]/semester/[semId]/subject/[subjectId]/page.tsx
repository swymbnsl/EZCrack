import { PageWrapper } from "@/components/layout/PageWrapper"
import { SubjectPageClient } from "@/components/subjects/SubjectPageClient"
import {
  getUnitsBySubjectId,
  getQuestionsBySubjectId,
  getSubjectById,
  getAllContributors,
  getContributorBySubjectId,
  getAllBranches,
} from "@/lib/data"
import { buildRoutePath } from "@/utils"
import type { Unit, Subject } from "@/types"

export async function generateStaticParams() {
  const branches = await getAllBranches()
  const params: { branchId: string; semId: string; subjectId: string }[] = []

  for (const branch of branches) {
    // branch.name is like "cse1", "it2", etc.
    const branchName = branch.name.replace(/\d+$/, "")
    const semNumber = branch.name.match(/\d+$/)?.[0] || "1"

    for (const subjectId of branch.subject_ids) {
      params.push({
        branchId: branchName,
        semId: semNumber,
        subjectId: String(subjectId),
      })
    }
  }

  return params
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ branchId: string; semId: string; subjectId: string }>
}) {
  const { branchId, semId, subjectId } = await params

  const [fetchedUnits, questions, contributors] = await Promise.all([
    getUnitsBySubjectId(subjectId),
    getQuestionsBySubjectId(subjectId),
    getAllContributors(),
  ])

  // Process units - extract subject from populated unit
  const units: Unit[] = fetchedUnits.map((unit) => ({
    ...unit,
    _id: String(unit._id),
    subject_id:
      typeof unit.subject_id === "object" && unit.subject_id
        ? String((unit.subject_id as Subject)._id)
        : String(unit.subject_id),
  }))

  // Derive subject
  let subject: Subject | null = null
  if (fetchedUnits.length > 0) {
    const subjectFromUnit = fetchedUnits[0].subject_id
    if (subjectFromUnit && typeof subjectFromUnit === "object") {
      subject = subjectFromUnit as Subject
    }
  }
  if (!subject) {
    subject = await getSubjectById(subjectId)
  }

  // Ensure question years are numbers
  const processedQuestions = questions.map((q) => ({
    ...q,
    year: typeof q.year === "string" ? parseInt(q.year as string) : q.year,
  }))

  // Get contributor
  const contributor = getContributorBySubjectId(subjectId, contributors)

  const backLink = buildRoutePath("/branch", branchId, "semester", semId)

  return (
    <PageWrapper>
      <SubjectPageClient
        units={units}
        questions={processedQuestions}
        subject={subject}
        contributor={contributor}
        branchId={branchId}
        semId={semId}
        subjectId={subjectId}
        backLink={backLink}
      />
    </PageWrapper>
  )
}
