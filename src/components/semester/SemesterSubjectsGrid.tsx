"use client"

import { motion } from "framer-motion"
import { Book } from "lucide-react"
import { SubjectCard } from "@/components/subjects/SubjectCard"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"
import type { Subject } from "@/types"

interface SemesterSubjectsGridProps {
  subjects: Subject[]
  isLoading: boolean
  branchId: string
  semId: string
}

export function SemesterSubjectsGrid({
  subjects,
  isLoading,
  branchId,
  semId,
}: SemesterSubjectsGridProps) {
  if (isLoading) {
    return <LoadingSpinner text="Loading subjects..." />
  }

  if (subjects.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
      >
        {subjects.map((subject, index) => (
          <SubjectCard
            key={subject._id}
            subject={subject}
            index={index}
            branchId={branchId}
            semId={semId}
          />
        ))}
      </motion.div>
    )
  }

  return (
    <EmptyState
      icon={Book}
      title="No Subjects Available"
      description={`No subjects are available for ${branchId.toUpperCase()} branch in Semester ${semId} yet. Check back later for updates.`}
      iconColor="text-blue-400"
      action={{
        label: "Go Back Home",
        onClick: () => (window.location.href = "/"),
      }}
    />
  )
}
