"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { useTheme } from "@/contexts/ThemeContext"

interface AnswerModalProps {
  isOpen: boolean
  onClose: () => void
  question: string
  answer: string
}

export function AnswerModal({
  isOpen,
  onClose,
  question,
  answer,
}: AnswerModalProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${
              isLight ? "bg-gray-500/50" : "bg-black/70"
            } backdrop-blur-sm z-50`}
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-3xl max-h-[85vh] flex flex-col ${
                isLight ? "bg-white border-black" : "bg-[#1E1E1E] border-white"
              } border-4 pointer-events-auto`}
            >
              {/* Header */}
              <div
                className={`p-4 sm:p-6 border-b-4 ${
                  isLight ? "border-black" : "border-white"
                } flex items-center justify-between flex-shrink-0`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${
                      isLight
                        ? "bg-[#76ABAE] border-black"
                        : "bg-[#4ECDC4] border-white"
                    } border-3 flex items-center justify-center`}
                  >
                    <MessageSquare
                      className={`w-5 h-5 ${
                        isLight ? "text-black" : "text-[#121212]"
                      }`}
                    />
                  </div>
                  <h2
                    className={`text-lg sm:text-xl font-bold ${
                      isLight ? "text-black" : "text-white"
                    }`}
                  >
                    Answer
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 ${
                    isLight
                      ? "bg-[#FF7B54] border-black hover:bg-[#FFD56B]"
                      : "bg-[#FF6B6B] border-white hover:bg-[#4ECDC4]"
                  } border-2 flex items-center justify-center transition-colors`}
                >
                  <X
                    className={`w-4 h-4 ${
                      isLight ? "text-black" : "text-[#121212]"
                    }`}
                  />
                </button>
              </div>

              {/* Content */}
              <div
                className={`flex-1 overflow-y-auto ${
                  isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"
                }`}
              >
                {/* Question Section */}
                <div
                  className={`p-4 sm:p-6 border-b-2 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-700 bg-[#1a1a1a]"
                  }`}
                >
                  <p
                    className={`text-xs sm:text-sm font-semibold mb-2 ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    QUESTION
                  </p>
                  <div
                    className={`prose ${
                      isLight ? "prose-black" : "prose-invert"
                    } max-w-none ${isLight ? "light-katex" : ""} ${
                      isLight ? "text-[#2D2A32]" : "text-gray-200"
                    } text-sm sm:text-base`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[
                        [rehypeKatex, { throwOnError: false, strict: false }],
                      ]}
                    >
                      {question}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Answer Section */}
                <div className="p-4 sm:p-6">
                  <p
                    className={`text-xs sm:text-sm font-semibold mb-3 ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    ANSWER
                  </p>
                  <div
                    className={`prose ${
                      isLight
                        ? "prose-black max-w-none prose-headings:text-black prose-strong:text-black prose-em:text-black/80"
                        : "prose-invert max-w-none"
                    } ${isLight ? "light-katex" : ""} ${
                      isLight ? "text-black" : "text-white"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[
                        [rehypeKatex, { throwOnError: false, strict: false }],
                      ]}
                    >
                      {answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
