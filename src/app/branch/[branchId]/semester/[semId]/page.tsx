"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Header } from "@/components/layout/Header"
import { SemesterSubjectsGrid } from "@/components/semester"
import { subjectsApi } from "@/services/api"
import { useTheme } from "@/contexts/ThemeContext"
import { sortSubjectsByName } from "@/utils"
import type { Subject } from "@/types"

export default function SubjectsPage() {
  const params = useParams()
  const { branchId, semId } = params
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isLight = theme === "light"

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await subjectsApi.getByBranchAndSemester(
          String(branchId),
          String(semId)
        )
        const sortedSubjects = sortSubjectsByName(response.subjects || [])
        setSubjects(sortedSubjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (branchId && semId) {
      fetchSubjects()
    }
  }, [branchId, semId])

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || ""
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || ""

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen sm:h-screen flex flex-col">
        <Header
          branchId={parsedBranchId}
          semId={parsedSemId}
          backLink="/"
          backText="Back to Home"
          title={`${parsedBranchId.toUpperCase()} Subjects`}
          subtitle={`${subjects.length} subjects to explore`}
          stats={{
            primary: { value: subjects.length, label: "Subjects" },
            secondary: { value: parsedSemId, label: "Semester" },
          }}
          showContributor={false}
        />

        <div
          className={`flex-1 flex flex-col overflow-hidden mt-6 sm:mt-0 ${
            isLight
              ? "bg-white sm:bg-[#F8F8F8]"
              : "bg-gradient-to-b from-gray-950 to-black sm:bg-[#121212]"
          }`}
        >
          <div
            className={`overflow-y-auto flex-1 h-full scrollbar-thin scrollbar-thumb-rounded-full ${
              isLight
                ? "scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/60"
                : "scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50"
            }`}
          >
            <div className="p-3 sm:p-8">
              <SemesterSubjectsGrid
                subjects={subjects}
                isLoading={isLoading}
                branchId={parsedBranchId}
                semId={parsedSemId}
              />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
