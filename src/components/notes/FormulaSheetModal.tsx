import { motion, AnimatePresence } from "framer-motion"
import { X, Calculator } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { useTheme } from "@/contexts/ThemeContext"

interface FormulaSheet {
  content: string
  createdAt: string
  updatedAt: string
}

interface FormulaSheetModalProps {
  isOpen: boolean
  onClose: () => void
  formulaSheet: FormulaSheet | null
  unitNumber: number
}

export function FormulaSheetModal({
  isOpen,
  onClose,
  formulaSheet,
  unitNumber,
}: FormulaSheetModalProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  if (!isOpen || !formulaSheet) return null

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
              className={`w-full max-w-2xl max-h-[85vh] flex flex-col ${
                isLight ? "bg-white border-black" : "bg-[#1E1E1E] border-white"
              } border-4 pointer-events-auto`}
            >
              <div
                className={`p-6 border-b-4 ${
                  isLight ? "border-black" : "border-white"
                } flex items-center justify-between flex-shrink-0`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${
                      isLight
                        ? "bg-[#FFD56B] border-black"
                        : "bg-[#4ECDC4] border-white"
                    } border-3 flex items-center justify-center`}
                  >
                    <Calculator
                      className={`w-5 h-5 ${
                        isLight ? "text-black" : "text-[#121212]"
                      }`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        isLight ? "text-black" : "text-white"
                      }`}
                    >
                      Unit {unitNumber} Formula Sheet
                    </h2>
                    <p
                      className={`text-sm ${
                        isLight ? "text-[#2D2A32]" : "text-gray-400"
                      }`}
                    >
                      Last updated:{" "}
                      {new Date(formulaSheet.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
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
              <div
                className={`p-6 overflow-y-auto flex-grow scrollbar-thin ${
                  isLight ? "bg-[#FFFFFA]" : "bg-[#121212]"
                }`}
              >
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
                    {formulaSheet.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
