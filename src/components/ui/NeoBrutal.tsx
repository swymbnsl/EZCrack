"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { ReactNode } from "react"

interface NeoBrutalCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode
  /** Additional className to append */
  className?: string
  /** Animation delay for stagger effects */
  delay?: number
  /** Whether to enable hover scale effect */
  enableHoverScale?: boolean
  /** Whether to enable hover rotate effect */
  enableHoverRotate?: boolean
  /** Custom padding (default: p-6) */
  padding?: string
  /** Border width (default: 4) */
  borderWidth?: 2 | 3 | 4
}

/**
 * NeoBrutalCard - A reusable card component with neobrutalism styling
 *
 * Features:
 * - Theme-aware background and border colors
 * - Neobrutalism shadow effect
 * - Optional hover animations (scale, rotate)
 * - Stagger animation support
 */
export function NeoBrutalCard({
  children,
  className = "",
  delay = 0,
  enableHoverScale = true,
  enableHoverRotate = false,
  padding = "p-6",
  borderWidth = 4,
  ...motionProps
}: NeoBrutalCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const borderClass = `border-${borderWidth}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={
        enableHoverScale || enableHoverRotate
          ? {
              scale: enableHoverScale ? 1.02 : 1,
              rotate: enableHoverRotate ? -1 : 0,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      className={`${
        isLight
          ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          : "bg-neo-card-dark border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
      } ${borderClass} ${padding} transition-all ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface NeoBrutalBadgeProps {
  children: ReactNode
  /** Badge variant - determines color scheme */
  variant?: "primary" | "secondary" | "accent" | "neutral"
  /** Size variant */
  size?: "sm" | "md"
  /** Additional className */
  className?: string
}

/**
 * NeoBrutalBadge - A reusable badge/tag component with neobrutalism styling
 */
export function NeoBrutalBadge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: NeoBrutalBadgeProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
  }

  const variantClasses = {
    primary: isLight
      ? "bg-neo-primary-light text-black border-black"
      : "bg-neo-primary-dark text-neo-bg-dark border-white",
    secondary: isLight
      ? "bg-neo-secondary-light text-black border-black"
      : "bg-neo-secondary-dark text-neo-bg-dark border-white",
    accent: isLight
      ? "bg-neo-accent-light text-black border-black"
      : "bg-neo-accent-dark text-neo-bg-dark border-white",
    neutral: isLight
      ? "bg-neo-bg-light-muted text-black border-black"
      : "bg-neo-bg-dark-muted text-white border-white",
  }

  return (
    <span
      className={`inline-flex items-center border-2 font-medium ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

interface NeoBrutalButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode
  /** Button variant */
  variant?: "primary" | "secondary" | "accent"
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Additional className */
  className?: string
  /** Is the button in a loading state */
  isLoading?: boolean
}

/**
 * NeoBrutalButton - A reusable button component with neobrutalism styling
 */
export function NeoBrutalButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  ...motionProps
}: NeoBrutalButtonProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const variantClasses = {
    primary: isLight
      ? "bg-neo-primary-light hover:bg-neo-primary-light-hover text-black border-black"
      : "bg-neo-primary-dark hover:bg-neo-primary-dark-hover text-neo-bg-dark border-white",
    secondary: isLight
      ? "bg-neo-secondary-light hover:bg-neo-secondary-light-alt text-black border-black"
      : "bg-neo-secondary-dark hover:bg-neo-secondary-dark-alt text-neo-bg-dark border-white",
    accent: isLight
      ? "bg-neo-accent-light hover:bg-neo-accent-light-hover text-black border-black"
      : "bg-neo-accent-dark hover:bg-neo-accent-dark-hover text-neo-bg-dark border-white",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`border-2 font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading}
      {...motionProps}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  /** Animation type */
  animation?: "fadeIn" | "slideUp" | "slideIn" | "scale"
  /** Animation delay */
  delay?: number
  /** Additional className */
  className?: string
}

/**
 * AnimatedContainer - A wrapper component for common animations
 */
export function AnimatedContainer({
  children,
  animation = "fadeIn",
  delay = 0,
  className = "",
  ...motionProps
}: AnimatedContainerProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  }

  const { initial, animate } = animations[animation]

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ delay }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: "sm" | "md" | "lg"
  /** Additional className */
  className?: string
}

/**
 * ThemedLoadingSpinner - A theme-aware loading spinner
 */
export function ThemedLoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 ${
          isLight
            ? "border-neo-primary-light/30 border-t-neo-primary-light"
            : "border-neo-primary-dark/30 border-t-neo-primary-dark"
        } rounded-full animate-spin`}
      />
    </div>
  )
}
