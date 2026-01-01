"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, Calculator } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import type { Unit, Topic } from "@/types"

interface UnitCardProps {
  unit: Unit
  index: number
  branchId: string
  semId: string
  subjectId: string
}

export function UnitCard({
  unit,
  index,
  branchId,
  semId,
  subjectId,
}: UnitCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark
  const hasNotes = unit.notes && unit.notes.length > 0
  const hasFormulaSheet = unit.formulaSheet && unit.formulaSheet.content

  // Helper to get topic title whether it's a string or Topic object
  const getTopicTitle = (topic: string | Topic): string => {
    return typeof topic === "string" ? topic : topic.title
  }

  return (
    <Link
      href={`/branch/${branchId}/semester/${semId}/subject/${subjectId}/unit/${unit._id}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{
          scale: 1.02,
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
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>
            Unit {unit.number}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 text-sm border-2"
              style={{
                backgroundColor: colors.secondary,
                color: colors.textOnAccent,
                borderColor: colors.border,
              }}
            >
              {unit.topics.length} topics
            </span>
          </div>
        </div>

        <div className="space-y-2" style={{ color: colors.text }}>
          {unit.topics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-sm">{getTopicTitle(topic)}</span>
            </div>
          ))}
          {unit.topics.length > 3 && (
            <p
              className="text-sm mt-2"
              style={{ color: isLight ? "#666" : "#aaa" }}
            >
              +{unit.topics.length - 3} more topics
            </p>
          )}
        </div>

        {(hasNotes || hasFormulaSheet) && (
          <div className="mt-4 flex gap-2">
            {hasNotes && (
              <div
                className="flex items-center gap-1 px-2 py-1 text-xs border"
                style={{
                  backgroundColor: colors.backgroundMuted,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <FileText className="w-3 h-3" />
                <span>Notes</span>
              </div>
            )}
            {hasFormulaSheet && (
              <div
                className="flex items-center gap-1 px-2 py-1 text-xs border"
                style={{
                  backgroundColor: colors.backgroundMuted,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <Calculator className="w-3 h-3" />
                <span>Formulas Sheet</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  )
}
