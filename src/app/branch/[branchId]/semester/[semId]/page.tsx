import { PageWrapper } from "@/components/layout/PageWrapper"
import { Header } from "@/components/layout/Header"
import { SemesterSubjectsGrid } from "@/components/semester"
import { getSubjectsByBranchAndSemester } from "@/lib/data"
import { sortSubjectsByName } from "@/utils"
import { branches, semesters } from "@/constants/lists"

export async function generateStaticParams() {
  const params: { branchId: string; semId: string }[] = []
  for (const branch of branches) {
    for (let i = 1; i <= semesters.length; i++) {
      params.push({ branchId: branch.toLowerCase(), semId: String(i) })
    }
  }
  return params
}

export default async function SubjectsPage({
  params,
}: {
  params: Promise<{ branchId: string; semId: string }>
}) {
  const { branchId, semId } = await params

  const rawSubjects = await getSubjectsByBranchAndSemester(branchId, semId)
  const subjects = sortSubjectsByName(rawSubjects || [])

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          branchId={branchId}
          semId={semId}
          backLink="/"
          backText="Back to Home"
          title={`${branchId.toUpperCase()} Subjects`}
          subtitle={`${subjects.length} subjects to explore`}
          stats={{
            primary: { value: subjects.length, label: "Subjects" },
            secondary: { value: semId, label: "Semester" },
          }}
          showContributor={false}
        />

        <main className="flex-1 w-full max-w-[2000px] mx-auto p-4 sm:p-6 md:p-8 mt-4 sm:mt-0">
          <SemesterSubjectsGrid
            subjects={subjects}
            isLoading={false}
            branchId={branchId}
            semId={semId}
          />
        </main>
      </div>
    </PageWrapper>
  )
}
