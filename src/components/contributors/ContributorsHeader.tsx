"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"

/**
 * ContributorsHeader - Header section for contributors page
 */
export function ContributorsHeader() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-12 text-center"
    >
      <h1
        className={`text-4xl font-bold mb-4 ${
          isLight ? "text-neo-text-light" : "text-white"
        }`}
      >
        Our Contributors
      </h1>
      <p
        className={`text-lg max-w-2xl mx-auto ${
          isLight ? "text-neo-text-light/80" : "text-gray-300"
        }`}
      >
        Meet the amazing people who have provided study materials and made
        EZCrack better for everyone.
      </p>
    </motion.div>
  )
}
