"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import type { Subject } from "@/types"

interface SubjectCardProps {
  subject: Subject & { subject_code?: string }
  index: number
  branchId: string | string[]
  semId: string
}

export function SubjectCard({
  subject,
  index,
  branchId,
  semId,
}: SubjectCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight ? commonColors.shadowLight : commonColors.shadowDark

  return (
    <Link
      href={`/branch/${branchId}/semester/${semId}/subject/${subject._id}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{
          scale: 1.02,
          rotate: -1,
          transition: { duration: 0.2 },
        }}
        className="border-4 p-6 transition-all"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          boxShadow: `4px 4px 0px 0px ${shadowColor}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `6px 6px 0px 0px ${shadowColor}`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${shadowColor}`
        }}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h2
                className="text-xl font-bold mb-2 relative inline-block"
                style={{ color: colors.text }}
              >
                <motion.span
                  className="absolute -inset-2 -z-10"
                  initial={{ rotate: 5 }}
                  animate={{ rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                ></motion.span>
                {subject.name}
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span
                  className="px-2.5 py-1 border-2"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.textOnAccent,
                    borderColor: colors.border,
                  }}
                >
                  {subject.subject_code || "CS-301"}
                </span>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 border-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.textOnAccent,
                    borderColor: colors.border,
                  }}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{subject.credits || 3} Credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
