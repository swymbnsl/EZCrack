import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  iconColor?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor,
}: EmptyStateProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-3 sm:px-4 text-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        whileHover={{
          boxShadow: `8px 8px 0px ${shadowColor}`,
        }}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-none border-3 sm:border-4 flex items-center justify-center mb-4 sm:mb-5 md:mb-6"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.backgroundCard,
          boxShadow: `4px 4px 0px 0px ${shadowColor}`,
          color: iconColor || colors.primary,
        }}
      >
        <Icon
          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${
            iconColor || colors.primary
          }`}
        />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-lg sm:text-xl font-bold mb-2"
        style={{ color: colors.text }}
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-sm sm:text-base max-w-md mb-6 sm:mb-8"
        style={{ color: colors.textMuted }}
      >
        {description}
      </motion.p>

      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{
            boxShadow: `8px 8px 0px ${shadowColor}`,
          }}
          whileTap={{
            boxShadow: `2px 2px 0px ${shadowColor}`,
            transform: "translateX(2px) translateY(2px)",
          }}
          onClick={action.onClick}
          className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 border-3 sm:border-4 font-bold text-sm sm:text-base rounded-none transition-all"
          style={{
            backgroundColor: isLight ? colors.secondary : colors.primary,
            color: colors.textOnPrimary,
            borderColor: colors.border,
            boxShadow: `4px 4px 0px 0px ${shadowColor}`,
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
