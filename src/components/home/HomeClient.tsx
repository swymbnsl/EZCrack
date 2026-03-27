"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dropdown } from "@/components/ui/Dropdown"
import { GradientButton } from "@/components/ui/GradientButton"
import { EmptyState } from "@/components/ui/EmptyState"
import { School, BookOpen } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

interface HomeClientProps {
  branches: string[]
  semesters: string[]
}

export function HomeClient({ branches, semesters }: HomeClientProps) {
  const router = useRouter()
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const { theme } = useTheme()
  const isLight = theme === "light"

  const handleGetStarted = () => {
    if (selectedBranch && selectedSemester) {
      const semNumber = selectedSemester.replace("Semester ", "")
      router.push(
        `/branch/${selectedBranch.toLowerCase()}/semester/${semNumber}`
      )
    }
  }

  return branches.length > 0 && semesters.length > 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-xl mx-auto px-0 sm:px-2 mt-4 sm:mt-0"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Dropdown
          options={branches}
          value={selectedBranch}
          onChange={setSelectedBranch}
          placeholder="Select Branch"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Dropdown
          options={semesters}
          value={selectedSemester}
          onChange={setSelectedSemester}
          placeholder="Select Semester"
        />
      </motion.div>

      <motion.div
        className="pt-1 sm:pt-2 md:pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <GradientButton
          onClick={handleGetStarted}
          disabled={!selectedBranch || !selectedSemester}
          className="w-full justify-center"
        >
          Get Started
        </GradientButton>
      </motion.div>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto mt-4 sm:mt-6 md:mt-8 px-0 sm:px-2"
    >
      <EmptyState
        icon={branches.length === 0 ? School : BookOpen}
        title={
          branches.length === 0
            ? "No Branches Available"
            : "No Semesters Available"
        }
        description={
          branches.length === 0
            ? "There are no branches available yet. Please check back later."
            : "There are no semesters available yet. Please check back later."
        }
        iconColor={
          branches.length === 0
            ? isLight
              ? "text-neo-primary-light"
              : "text-neo-primary-dark"
            : isLight
            ? "text-neo-accent-light"
            : "text-neo-accent-dark"
        }
      />
    </motion.div>
  )
}
