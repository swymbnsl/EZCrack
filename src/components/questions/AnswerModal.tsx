"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme } from "@/constants/colors"

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
  const colors = isLight ? lightTheme : darkTheme

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm z-50"
            style={{
              backgroundColor: isLight
                ? "rgba(107, 114, 128, 0.5)"
                : "rgba(0, 0, 0, 0.7)",
            }}
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-3xl max-h-[85vh] flex flex-col border-4 pointer-events-auto"
              style={{
                backgroundColor: colors.backgroundCard,
                borderColor: colors.border,
              }}
            >
              {/* Header */}
              <div
                className="p-4 sm:p-6 border-b-4 flex items-center justify-between flex-shrink-0"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 border-3 flex items-center justify-center"
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.border,
                    }}
                  >
                    <MessageSquare
                      className="w-5 h-5"
                      style={{ color: colors.textOnPrimary }}
                    />
                  </div>
                  <h2
                    className="text-lg sm:text-xl font-bold"
                    style={{ color: colors.text }}
                  >
                    Answer
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 border-2 flex items-center justify-center transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: colors.accent,
                    borderColor: colors.border,
                  }}
                >
                  <X
                    className="w-4 h-4"
                    style={{ color: colors.textOnAccent }}
                  />
                </button>
              </div>

              {/* Content */}
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  backgroundColor: colors.background,
                }}
              >
                {/* Question Section */}
                <div
                  className="p-4 sm:p-6 border-b-2"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundMuted,
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-semibold mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    QUESTION
                  </p>
                  <div
                    className={`prose ${
                      isLight
                        ? "prose-black prose-blockquote:text-gray-800 prose-blockquote:border-gray-400 prose-code:text-black prose-code:bg-gray-400"
                        : "prose-invert"
                    } max-w-none ${
                      isLight ? "light-katex" : ""
                    } text-sm sm:text-base`}
                    style={{ color: colors.text }}
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
                    className="text-xs sm:text-sm font-semibold mb-3"
                    style={{ color: colors.textMuted }}
                  >
                    ANSWER
                  </p>
                  <div
                    className={`prose ${
                      isLight
                        ? "prose-black max-w-none prose-headings:text-black prose-strong:text-black prose-em:text-black/90 prose-blockquote:text-gray-800 prose-blockquote:border-gray-400 prose-code:text-black prose-code:bg-gray-100 prose-pre:bg-gray-100 prose-pre:text-gray-900 prose-a:text-blue-700 prose-li:text-black prose-p:text-black"
                        : "prose-invert max-w-none"
                    } ${isLight ? "light-katex" : ""}`}
                    style={{ color: colors.text }}
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
