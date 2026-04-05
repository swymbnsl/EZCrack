import { Hero } from "@/components/home/Hero"
import { HomeClient } from "@/components/home/HomeClient"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Navbar } from "@/components/layout/Navbar"
import { branches, semesters } from "@/constants/lists"

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-center pb-16 pt-24 sm:pt-20 sm:py-6">
        <Hero />
        <HomeClient branches={branches} semesters={semesters} />
      </main>
    </PageWrapper>
  )
}
