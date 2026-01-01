"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dropdown } from "@/components/ui/Dropdown"
import { GradientButton } from "@/components/ui/GradientButton"
import { Hero } from "@/components/home/Hero"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Navbar } from "@/components/layout/Navbar"
import { EmptyState } from "@/components/ui/EmptyState"
import { School, BookOpen } from "lucide-react"
import { branches, semesters } from "@/constants/lists"
import { useTheme } from "@/contexts/ThemeContext"
import { AttentionNotice } from "@/components/ui/AttentionNotice"

export default function Home() {
  const router = useRouter()
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [availableBranches, setAvailableBranches] = useState<string[]>([])
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([])
  const { theme } = useTheme()
  const isLight = theme === "light"

  useEffect(() => {
    setAvailableBranches(branches)
    setAvailableSemesters(semesters)
    setIsLoading(false)
  }, [])

  const handleGetStarted = () => {
    if (selectedBranch && selectedSemester) {
      const semNumber = selectedSemester.replace("Semester ", "")
      router.push(
        `/branch/${selectedBranch.toLowerCase()}/semester/${semNumber}`
      )
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-center pb-16 pt-24 sm:pt-20 sm:py-6"
      >
        <Hero />

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-4 sm:py-8"
          >
            <motion.div
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-4 ${
                isLight
                  ? "border-neo-accent-light/30 border-t-neo-accent-light"
                  : "border-neo-accent-dark/30 border-t-neo-accent-dark"
              } rounded-none`}
              animate={{
                rotate: 360,
                boxShadow: [
                  isLight
                    ? "4px 4px 0px rgba(0,0,0,1)"
                    : "4px 4px 0px rgba(255,255,255,0.8)",
                  isLight
                    ? "1px 1px 0px rgba(0,0,0,1)"
                    : "1px 1px 0px rgba(255,255,255,0.8)",
                  isLight
                    ? "4px 4px 0px rgba(0,0,0,1)"
                    : "4px 4px 0px rgba(255,255,255,0.8)",
                ],
              }}
              transition={{
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                boxShadow: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>
        ) : availableBranches.length > 0 && availableSemesters.length > 0 ? (
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
                options={availableBranches}
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
                options={availableSemesters}
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
              icon={availableBranches.length === 0 ? School : BookOpen}
              title={
                availableBranches.length === 0
                  ? "No Branches Available"
                  : "No Semesters Available"
              }
              description={
                availableBranches.length === 0
                  ? "There are no branches available yet. Please check back later."
                  : "There are no semesters available yet. Please check back later."
              }
              iconColor={
                availableBranches.length === 0
                  ? isLight
                    ? "text-neo-primary-light"
                    : "text-neo-primary-dark"
                  : isLight
                  ? "text-neo-accent-light"
                  : "text-neo-accent-dark"
              }
            />
          </motion.div>
        )}
      </motion.main>
      <AttentionNotice
        message={
          <>
            <p>
              The platform is still under development, and the material will be
              significantly improved.
            </p>
            <p className="mt-2">
              Currently, only 1st-year and some 2rd-year material have been
              uploaded. The rest will be added soon.
            </p>
            <p className="mt-2">
              Join the WhatsApp community to request material or contribute your
              own.
            </p>
          </>
        }
      />
    </PageWrapper>
  )
}
