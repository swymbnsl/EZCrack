"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Info } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface AttentionNoticeProps {
  message: ReactNode
}

export const AttentionNotice = ({ message }: AttentionNoticeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  useEffect(() => {
    // Check if the notice has been closed before
    const hasNoticeClosed =
      localStorage.getItem("attentionNoticeClosed") === "true"

    // Display button after a slight delay
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 1000)

    // If not closed before, show the modal after a slight delay
    if (!hasNoticeClosed) {
      setTimeout(() => {
        setIsNoticeOpen(true)
      }, 1500)
    }

    return () => clearTimeout(timer)
  }, [])

  // Handle closing the notice and saving to localStorage
  const handleCloseNotice = () => {
    setIsNoticeOpen(false)
    localStorage.setItem("attentionNoticeClosed", "true")
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed sm:right-6 right-auto left-6 sm:left-auto bottom-6 z-40">
            <button
              onClick={() => setIsNoticeOpen(true)}
              className="relative flex items-center justify-center w-[70px] h-[70px] border-4 rounded-full hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{
                backgroundColor: colors.error,
                borderColor: colors.border,
                boxShadow: `2px 2px 0px 0px ${shadowColor}`,
              }}
            >
              <Info
                className="w-9 h-9"
                style={{ color: isLight ? "#ffffff" : colors.textOnAccent }}
              />

              {/* Notification dot */}
              <span
                className="absolute top-0 right-0 w-4 h-4 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></span>
            </button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNoticeOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 ${
                isLight ? "bg-gray-500/50" : "bg-black/70"
              } backdrop-blur-sm z-50`}
              onClick={handleCloseNotice}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md flex flex-col overflow-hidden border-4 rounded-xl pointer-events-auto"
                style={{
                  backgroundColor: colors.backgroundCard,
                  borderColor: colors.border,
                  boxShadow: `6px 6px 0px 0px ${shadowColor}`,
                }}
              >
                <div
                  className="p-4 border-b-4 flex items-center justify-between flex-shrink-0"
                  style={{
                    backgroundColor: colors.error,
                    borderColor: colors.border,
                    color: isLight ? "#ffffff" : colors.textOnAccent,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Info className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Important Note!</h2>
                  </div>
                  <button
                    onClick={handleCloseNotice}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div
                  className="p-6"
                  style={{
                    backgroundColor: isLight
                      ? lightTheme.backgroundPaper
                      : darkTheme.background,
                  }}
                >
                  <div
                    className="text-lg font-medium"
                    style={{ color: colors.text }}
                  >
                    {message}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseNotice}
                      className="px-6 py-2 font-bold text-center border-2 rounded-full hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.textOnPrimary,
                        borderColor: colors.border,
                        boxShadow: `3px 3px 0px 0px ${shadowColor}`,
                      }}
                    >
                      Got it!
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
