"use client"

import { useTheme } from "@/contexts/ThemeContext"

/**
 * ContributorsLoading - Loading state for contributors page
 */
export function ContributorsLoading() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <div className="flex justify-center items-center py-20">
      <div
        className={`w-12 h-12 border-4 ${
          isLight
            ? "border-neo-primary-light/30 border-t-neo-primary-light"
            : "border-neo-primary-dark/30 border-t-neo-primary-dark"
        } rounded-full animate-spin`}
      />
    </div>
  )
}
