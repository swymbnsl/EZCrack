"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-none border-4 transition-all"
      style={{
        backgroundColor: isLight
          ? lightTheme.backgroundPaper
          : darkTheme.backgroundCard,
      }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" style={{ color: colors.text }} />
      ) : (
        <Sun className="w-5 h-5" style={{ color: colors.text }} />
      )}
    </motion.button>
  )
}
