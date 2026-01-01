"use client"

import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"

interface PageWrapperProps {
  children: React.ReactNode
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div
      className="min-h-screen relative overflow-x-hidden max-w-screen"
      style={{
        backgroundColor: isLight
          ? lightTheme.backgroundPaper
          : darkTheme.background,
        color: colors.text,
      }}
    >
      <AnimatedBackground />
      {children}
    </div>
  )
}
