"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { usePathname } from "next/navigation"
import { lightTheme, darkTheme } from "@/constants/colors"

export const AnimatedBackground = () => {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const pathname = usePathname()
  const [hoveredShape, setHoveredShape] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const showOnPages = pathname === "/" || pathname === "/notice"

  if (!showOnPages) return null

  const shapes = [
    {
      top: "10%",
      left: "20%",
      size: isMobile ? "w-16 h-16" : "w-24 h-24",
      color: isLight ? lightTheme.accent : darkTheme.accent,
      rotate: "12deg",
      mobileHide: false,
    },
    {
      top: "35%",
      right: "15%",
      size: isMobile ? "w-20 h-20" : "w-32 h-32",
      color: isLight ? lightTheme.secondaryAlt : darkTheme.primary,
      rotate: "-6deg",
      mobileHide: true,
    },
    {
      bottom: "20%",
      left: "30%",
      size: isMobile ? "w-24 h-24" : "w-40 h-40",
      color: isLight ? lightTheme.primary : darkTheme.secondary,
      rotate: "45deg",
      mobileHide: false,
    },
    {
      bottom: "15%",
      right: "15%",
      size: isMobile ? "w-20 h-20" : "w-28 h-28",
      color: isLight ? lightTheme.gray : darkTheme.secondaryAlt,
      rotate: "-12deg",
      mobileHide: false,
    },
    {
      top: "60%",
      left: "10%",
      size: "w-20 h-20",
      color: isLight ? lightTheme.gray : darkTheme.accentGreen,
      rotate: "20deg",
      mobileHide: true,
    },
    {
      top: "15%",
      right: "30%",
      size: "w-16 h-16",
      color: isLight ? lightTheme.secondary : darkTheme.accentPink,
      rotate: "30deg",
      mobileHide: false,
    },
  ]

  const displayShapes = isMobile
    ? shapes.filter((shape) => !shape.mobileHide)
    : shapes

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isLight
            ? lightTheme.backgroundPaper
            : darkTheme.background,
        }}
      >
        {displayShapes.map((shape, index) => (
          <motion.div
            key={index}
            className={`absolute ${shape.size}
              border-2 sm:border-4 ${
                isLight ? "border-black" : "border-white"
              } cursor-pointer`}
            style={{
              top: shape.top || "auto",
              left: shape.left || "auto",
              right: shape.right || "auto",
              bottom: shape.bottom || "auto",
              zIndex: hoveredShape === index ? 10 : 1,
              backgroundColor: shape.color,
            }}
            initial={{
              boxShadow: isLight
                ? "3px 3px 0px rgba(0,0,0,1)"
                : "3px 3px 0px rgba(255,255,255,0.8)",
            }}
            animate={{
              y: isMobile ? [0, -5, 0] : [0, -10, 0],
              boxShadow:
                hoveredShape === index
                  ? isLight
                    ? "6px 6px 0px rgba(0,0,0,1)"
                    : "6px 6px 0px rgba(255,255,255,0.8)"
                  : isLight
                  ? "3px 3px 0px rgba(0,0,0,1)"
                  : "3px 3px 0px rgba(255,255,255,0.8)",
            }}
            transition={{
              y: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3 + index,
                ease: "easeInOut",
              },
              boxShadow: { duration: 0.2 },
            }}
            onMouseEnter={() => setHoveredShape(index)}
            onMouseLeave={() => setHoveredShape(null)}
            whileHover={{
              scale: 1.05,
              rotate: shape.rotate,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            whileTap={{
              scale: 0.95,
              rotate: "0deg",
              transition: { duration: 0.2 },
            }}
          />
        ))}

        {/* Grid overlay - Ig it looks good subtly visible, might increase opacity if received any such review */}
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"
              : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"
          }`}
        ></div>
      </div>
    </div>
  )
}
