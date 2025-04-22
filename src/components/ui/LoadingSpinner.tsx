import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"

interface LoadingSpinnerProps {
  text: string
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <motion.div className="text-center py-20">
      <div
        className={`inline-block p-3 ${
          isLight
            ? "bg-[#F5F5F5] border-black/10"
            : "bg-gray-800/50 border-gray-700/50"
        } border rounded-lg`}
      >
        <div
          className={`w-6 h-6 border-2 ${
            isLight
              ? "border-[#457f82] border-t-transparent"
              : "border-[#4ECDC4] border-t-transparent"
          } rounded-full animate-spin`}
        />
      </div>
      <p
        className={`${isLight ? "text-[#2D2A32]" : "text-white"} text-lg mt-4`}
      >
        {text}
      </p>
    </motion.div>
  )
}
