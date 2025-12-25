import { useState, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {  X, Info } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

interface AttentionNoticeProps {
  message: ReactNode
}

export const AttentionNotice = ({ message }: AttentionNoticeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === "light"

  useEffect(() => {
    // Check if the notice has been closed before
    const hasNoticeClosed = localStorage.getItem("attentionNoticeClosed") === "true"
    
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
              className={`relative flex items-center justify-center w-[70px] h-[70px] 
                ${
                  isLight
                    ? "bg-[#FF6B6B] border-black"
                    : "bg-[#FF6B6B] border-white"
                } border-4 rounded-full
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
                hover:translate-x-0.5 hover:translate-y-0.5 
                transition-all`}
            >
              <Info
                className={`w-9 h-9 ${
                  isLight ? "text-white" : "text-[#121212]"
                }`}
              />

              {/* Notification dot */}
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#4ECDC4]"></span>
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
                className={`w-full max-w-md flex flex-col overflow-hidden
                  ${
                    isLight
                      ? "bg-white border-black"
                      : "bg-[#1E1E1E] border-white"
                  } border-4 rounded-xl pointer-events-auto
                  ${
                    isLight
                      ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                      : "shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
                  }`}
              >
                <div
                  className={`p-4 border-b-4 ${
                    isLight ? "border-black" : "border-white"
                  } 
                    flex items-center justify-between flex-shrink-0
                    ${
                      isLight
                        ? "bg-[#FF6B6B] text-white"
                        : "bg-[#FF6B6B] text-[#121212]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 bg-white/20 rounded-full flex items-center justify-center`}
                    >
                      <Info
                        className={`w-5 h-5 ${
                          isLight ? "text-white" : "text-[#121212]"
                        }`}
                      />
                    </div>
                    <h2 className="text-xl font-bold">Important Note!</h2>
                  </div>
                  <button
                    onClick={handleCloseNotice}
                    className={`w-8 h-8 ${
                      isLight
                        ? "bg-white/20 hover:bg-white/30"
                        : "bg-white/20 hover:bg-white/30"
                    } rounded-full flex items-center justify-center transition-colors`}
                  >
                    <X
                      className={`w-4 h-4 ${
                        isLight ? "text-white" : "text-[#121212]"
                      }`}
                    />
                  </button>
                </div>
                <div
                  className={`p-6 ${isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"}`}
                >
                  <div
                    className={`text-lg font-medium ${
                      isLight ? "text-black" : "text-white"
                    }`}
                  >
                    {message}
                  </div>
                  <div className="mt-4 flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCloseNotice}
                      className={`px-6 py-2 font-bold text-center
                        ${
                          isLight
                            ? "bg-[#4ECDC4] text-white border-black"
                            : "bg-[#4ECDC4] text-[#121212] border-white"
                        } border-2 rounded-full 
                        ${
                          isLight
                            ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                            : "shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)]"
                        }
                        hover:translate-y-0.5 hover:translate-x-0.5 
                        hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] 
                        transition-all`}
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
