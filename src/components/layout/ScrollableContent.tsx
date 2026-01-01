import { ReactNode } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"

interface ScrollableContentProps {
  children: ReactNode
}

export function ScrollableContent({ children }: ScrollableContentProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme

  return (
    <div
      className="flex-1 flex flex-col sm:overflow-hidden"
      style={{
        background: isLight
          ? `${colors.background}`
          : `linear-gradient(to bottom, #0a0a0a, ${colors.background})`,
      }}
    >
      <div
        className="h-full sm:overflow-y-auto sm:flex-1 scrollbar-thin scrollbar-thumb-rounded-full"
        style={{
          scrollbarColor: isLight
            ? "rgba(156, 163, 175, 0.4) rgba(229, 231, 235, 0.4)"
            : "rgba(75, 85, 99, 0.4) rgba(31, 41, 55, 0.4)",
        }}
      >
        <div className="p-3 sm:p-8">{children}</div>
      </div>
    </div>
  )
}
