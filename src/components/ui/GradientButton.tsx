import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface NeoBrutalistButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const GradientButton = ({
  onClick,
  disabled = false,
  children,
  className = "",
}: NeoBrutalistButtonProps) => {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={
        !disabled
          ? {
              boxShadow: `8px 8px 0px ${shadowColor}`,
            }
          : {}
      }
      whileTap={
        !disabled
          ? {
              boxShadow: `2px 2px 0px ${shadowColor}`,
              transform: "translateX(2px) translateY(2px)",
            }
          : {}
      }
      transition={{ duration: 0.2 }}
      className={`w-full p-3 sm:p-4 md:p-5 rounded-none font-bold text-base sm:text-lg border-4 transition-all ${
        disabled ? "cursor-not-allowed" : ""
      } ${className}`}
      style={{
        backgroundColor: disabled
          ? isLight
            ? "#d1d5db"
            : "#374151"
          : colors.accent,
        color: disabled
          ? isLight
            ? "#4b5563"
            : "#9ca3af"
          : colors.textOnAccent,
        borderColor: disabled
          ? isLight
            ? "#4b5563"
            : "#6b7280"
          : colors.border,
        boxShadow: disabled
          ? isLight
            ? "4px 4px 0px rgba(100,100,100,1)"
            : "4px 4px 0px rgba(150,150,150,0.6)"
          : `8px 8px 0px 0px ${shadowColor}`,
      }}
    >
      {children}
    </motion.button>
  )
}
