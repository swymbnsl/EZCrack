import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"

interface LoadingSpinnerProps {
  text: string
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <motion.div className="text-center py-20">
      <div
        className={`inline-block p-3 border rounded-lg`}
        style={{
          backgroundColor: isLight
            ? colors.backgroundCard
            : "rgba(55, 65, 81, 0.5)",
          borderColor: isLight ? "rgba(0,0,0,0.1)" : "rgba(75, 85, 99, 0.5)",
        }}
      >
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: colors.primary, borderTopColor: "transparent" }}
        />
      </div>
      <p className="text-lg mt-4" style={{ color: colors.text }}>
        {text}
      </p>
    </motion.div>
  )
}
