"use client"

import { motion } from "framer-motion"
import { Calendar, FileText } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import type { Topic } from "@/types"

interface TopicCardProps {
  topic: Topic
  index: number
  onTopicClick?: () => void
  hasNotes?: boolean
}

export function TopicCard({
  topic,
  index,
  onTopicClick,
  hasNotes = false,
}: TopicCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        rotate: -1,
        transition: { duration: 0.2 },
      }}
      onClick={onTopicClick}
      className="w-full border-4 p-6 transition-all cursor-pointer"
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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onTopicClick?.()
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h2
              className="text-xl font-bold mb-2 relative inline-block"
              style={{ color: colors.text }}
            >
              {topic.title}
            </h2>
            <div className="flex items-center gap-3">
              <span
                className="px-2.5 py-1 text-sm border-2"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                {topic.weightage}% Weightage
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div
          className="relative h-2 overflow-hidden border-2"
          style={{ borderColor: colors.border }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${topic.weightage}%` }}
            transition={{
              duration: 1,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="absolute inset-y-0 left-0"
            style={{ backgroundColor: colors.primary }}
          />
        </div>
        <div className="text-sm" style={{ color: colors.text }}>
          {topic.questions?.length} questions available
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="mt-6 flex flex-wrap gap-2 items-center justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {topic.years?.map((year) => (
            <span
              key={year}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm border-2"
              style={{
                backgroundColor: colors.accent,
                color: colors.textOnAccent,
                borderColor: colors.border,
              }}
            >
              <Calendar className="w-3 h-3" />
              {year}
            </span>
          ))}
        </div>

        {hasNotes && (
          <div
            className="flex items-center gap-1 px-3 py-1.5 text-sm border-2"
            style={{
              backgroundColor: colors.primary,
              color: colors.textOnPrimary,
              borderColor: colors.border,
            }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Notes</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
