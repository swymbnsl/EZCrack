import { motion } from "framer-motion"
import { BookOpen, Linkedin } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import type { Contributor } from "@/types"

interface ContributorBadgeProps {
  contributor: Contributor
}

export function ContributorBadge({ contributor }: ContributorBadgeProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <div className="flex-1 lg:w-[30vw]">
      <div
        className="border-4 p-3 sm:p-4 h-[88px] flex items-center"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          boxShadow: `4px 4px 0px 0px ${shadowColor}`,
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <div className="relative group">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden border-3"
              style={{ borderColor: colors.border }}
            >
              <Image
                src={contributor.avatar}
                alt={contributor.name}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 border-2 flex items-center justify-center"
              style={{
                backgroundColor: colors.secondary,
                borderColor: colors.border,
              }}
            >
              <BookOpen
                className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                style={{ color: colors.textOnAccent }}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3
                className="font-bold text-sm sm:text-base truncate"
                style={{ color: colors.text }}
              >
                {contributor.name}
              </h3>
              <span
                className="text-xs"
                style={{
                  color: isLight ? lightTheme.text : darkTheme.textMuted,
                }}
              >
                • {contributor.subject_ids.length} subjects
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span
                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 border-2 truncate"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.textOnPrimary,
                  borderColor: colors.border,
                }}
              >
                {contributor.branch}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 border-2 whitespace-nowrap"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                Sem {contributor.semester}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 border-2 whitespace-nowrap"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                {contributor.subject_ids.length} contributions
              </span>
            </div>
          </div>

          {contributor.linkedinUrl && (
            <motion.a
              href={contributor.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 border-2 transition-colors flex items-center justify-center self-center shrink-0"
              style={{
                backgroundColor: colors.accent,
                color: colors.textOnAccent,
                borderColor: colors.border,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.secondary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.accent
              }}
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          )}
        </div>
      </div>
    </div>
  )
}
