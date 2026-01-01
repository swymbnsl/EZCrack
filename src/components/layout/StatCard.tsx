import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"
import type { StatCardProps } from "@/types"

export function StatCard({ value, label }: StatCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <div
      className="flex-1 sm:flex-none sm:w-28 md:w-32 h-[88px] text-center px-2 sm:px-4 py-2 sm:py-3 border-4 flex flex-col items-center justify-center"
      style={{
        backgroundColor: colors.backgroundCard,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: `4px 4px 0px 0px ${shadowColor}`,
      }}
    >
      <div
        className="text-xl sm:text-2xl font-bold"
        style={{ color: colors.accent }}
      >
        {value}
      </div>
      <div
        className="text-xs sm:text-sm"
        style={{ color: isLight ? lightTheme.text : darkTheme.textMuted }}
      >
        {label}
      </div>
    </div>
  )
}
