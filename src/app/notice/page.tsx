"use client"

import { motion } from "framer-motion"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { useTheme } from "@/contexts/ThemeContext"
import { Info } from "lucide-react"

export default function NoticePage() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <PageWrapper>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-center pb-16 pt-24 sm:pt-20 sm:py-6"
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`w-full max-w-md flex flex-col overflow-hidden
              ${isLight
                ? "bg-white border-black"
                : "bg-[#1E1E1E] border-white"
              } border-4 rounded-xl
              ${isLight
                ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                : "shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
              }`}
          >
            <div
              className={`p-4 border-b-4 ${isLight ? "border-black" : "border-white"} 
                flex items-center justify-between flex-shrink-0
                ${isLight
                  ? "bg-[#FF6B6B] text-white"
                  : "bg-[#FF6B6B] text-[#121212]"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center`}
                >
                  <Info
                    className={`w-5 h-5 ${isLight ? "text-white" : "text-[#121212]"}`}
                  />
                </div>
                <h2 className="text-xl font-bold">Service Notice</h2>
              </div>
            </div>
            <div
              className={`p-6 ${isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"}`}
            >
              <div
                className={`text-lg font-medium ${isLight ? "text-black" : "text-white"}`}
              >
                <p>EZCrack has been paused for some time. It is being improved and will be back soon.</p>
                <p className="mt-4 text-sm opacity-70">We appreciate your patience and understanding.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </PageWrapper>
  )
}