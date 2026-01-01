"use client"

import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Navbar } from "@/components/layout/Navbar"
import { ContributorsHeader, ContributorsGrid } from "@/components/contributors"
import { useTheme } from "@/contexts/ThemeContext"

export default function ContributorsPage() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <PageWrapper>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen pt-32 px-4 max-w-6xl mx-auto ${
          isLight ? "text-neo-text-light" : "text-white"
        }`}
      >
        <ContributorsHeader />
        <ContributorsGrid />
      </motion.main>
    </PageWrapper>
  )
}
