import { PageWrapper } from "@/components/layout/PageWrapper"
import { UnitPageClient } from "@/components/topics/UnitPageClient"
import {
  getUnitById,
  getQuestionsByUnitAndSubject,
  getAllContributors,
  getContributorBySubjectId,
  getAllUnits,
} from "@/lib/data"
import { generateAnalysisData } from "@/lib/analysis"
import type { RawQuestion, QuestionsData } from "@/types"

export async function generateStaticParams() {
  const units = await getAllUnits()
  const params: {
    branchId: string
    semId: string
    subjectId: string
    unitId: string
  }[] = []

  for (const unit of units) {
    const subjectData = unit.subject_id
    if (!subjectData) continue

    const subjectId =
      typeof subjectData === "object"
        ? String(subjectData._id)
        : String(subjectData)

    params.push({
      branchId: "placeholder",
      semId: "placeholder",
      subjectId,
      unitId: String(unit._id),
    })
  }

  return params
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{
    branchId: string
    semId: string
    subjectId: string
    unitId: string
  }>
}) {
  const { branchId, semId, subjectId, unitId } = await params

  const [rawUnit, contributors] = await Promise.all([
    getUnitById(unitId),
    getAllContributors(),
  ])

  if (!rawUnit) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <p>Unit not found</p>
        </div>
      </PageWrapper>
    )
  }

  // Fetch questions using the unit number
  const actualQuestions = await getQuestionsByUnitAndSubject(
    rawUnit.number,
    subjectId
  )

  const questionsData: QuestionsData = {
    foundQuestions: actualQuestions.map((q) => ({
      ...q,
      _id: String(q._id),
      year: typeof q.year === "string" ? parseInt(q.year as string) : q.year,
    })) as RawQuestion[],
  }

  const unit = generateAnalysisData(rawUnit, questionsData)

  // Get contributor
  const contributor = getContributorBySubjectId(subjectId, contributors)

  return (
    <PageWrapper>
      <UnitPageClient
        unit={unit}
        contributor={contributor}
        branchId={branchId}
        semId={semId}
        subjectId={subjectId}
      />
    </PageWrapper>
  )
}
