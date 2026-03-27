import { PageWrapper } from "@/components/layout/PageWrapper"
import { Navbar } from "@/components/layout/Navbar"
import { ContributorsHeader, ContributorsGrid } from "@/components/contributors"
import { getAllContributors } from "@/lib/data"

export default async function ContributorsPage() {
  const contributors = await getAllContributors()

  return (
    <PageWrapper>
      <Navbar />
      <main className="min-h-screen pt-32 px-4 max-w-6xl mx-auto">
        <ContributorsHeader />
        <ContributorsGrid contributors={contributors} />
      </main>
    </PageWrapper>
  )
}
