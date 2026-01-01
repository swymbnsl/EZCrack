import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ContributorBadge } from "@/components/shared/ContributorBadge"
import { useTheme } from "@/contexts/ThemeContext"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { lightTheme, darkTheme } from "@/constants/colors"
import { WeightageInfo } from "./WeightageInfo"
import { StatCard } from "./StatCard"
import type { HeaderProps } from "@/types"

export function Header({
  branchId,
  semId,
  backLink,
  backText,
  title,
  subtitle,
  stats,
  showContributor = true,
  showWeightageInfo = false,
  contributor,
}: HeaderProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div
      className="border-b-4 shadow-lg relative z-20"
      style={{
        borderColor: colors.border,
        backgroundColor: isLight
          ? lightTheme.backgroundPaper
          : darkTheme.background,
      }}
    >
      <div className="max-w-[2000px] mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <Link
              href={backLink}
              className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base transition-colors group"
              style={{ color: colors.text }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = colors.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text
              }}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {backText}
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 border-2"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.textOnAccent,
                  borderColor: colors.border,
                }}
              >
                {Array.isArray(branchId)
                  ? branchId[0].toUpperCase()
                  : branchId?.toUpperCase()}
              </span>
              <span
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 border-2"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.textOnPrimary,
                  borderColor: colors.border,
                }}
              >
                Sem {semId}
              </span>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 relative inline-block"
                  style={{ color: colors.text }}
                >
                  <motion.span
                    className="absolute -inset-2 -z-10"
                    initial={{ rotate: 5 }}
                    animate={{ rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  ></motion.span>
                  {title}
                </h1>
                <p
                  className="text-sm sm:text-base md:text-lg flex items-center gap-2"
                  style={{
                    color: isLight ? lightTheme.text : darkTheme.textMuted,
                  }}
                >
                  {subtitle}
                </p>
              </div>
              <div className="block sm:hidden">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {showWeightageInfo && (
                <div className="w-full sm:w-auto">
                  <WeightageInfo />
                </div>
              )}

              {showContributor && contributor && (
                <div className="w-full sm:w-auto">
                  <ContributorBadge contributor={contributor} />
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <StatCard
                  value={stats.primary.value}
                  label={stats.primary.label}
                />
                <StatCard
                  value={stats.secondary.value}
                  label={stats.secondary.label}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
