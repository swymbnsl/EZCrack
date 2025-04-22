import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

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
          boxShadow: isLight
            ? "8px 8px 0px rgba(0,0,0,1)"
            : "8px 8px 0px rgba(255,255,255,0.8)",
        }}
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-none border-3 sm:border-4 ${
          isLight
            ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            : "border-white bg-[#1E1E1E] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]"
        } flex items-center justify-center mb-4 sm:mb-5 md:mb-6 ${
          !iconColor
            ? isLight
              ? "text-[#457f82]"
              : "text-[#4ECDC4]"
            : iconColor.includes("text-")
            ? iconColor.replace("text-", "text-")
            : `text-${iconColor}-400`
        }`}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`text-lg sm:text-xl font-bold mb-2 ${
          isLight ? "text-black" : "text-white"
        }`}
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className={`${
          isLight ? "text-gray-600" : "text-gray-400"
        } text-sm sm:text-base max-w-md mb-6 sm:mb-8`}
      >
        {description}
      </motion.p>

      {action && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          whileHover={{
            boxShadow: isLight
              ? "8px 8px 0px rgba(0,0,0,1)"
              : "8px 8px 0px rgba(255,255,255,0.8)",
          }}
          whileTap={{
            boxShadow: isLight
              ? "2px 2px 0px rgba(0,0,0,1)"
              : "2px 2px 0px rgba(255,255,255,0.8)",
            transform: "translateX(2px) translateY(2px)",
          }}
          onClick={action.onClick}
          className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 ${
            isLight
              ? "bg-[#FFD56B] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              : "bg-[#4ECDC4] text-[#121212] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]"
          } 
            border-3 sm:border-4 font-bold text-sm sm:text-base rounded-none transition-all`}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
