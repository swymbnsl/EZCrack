import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Info } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

interface FormulaModalProps {
  onClose: () => void
}

export function FormulaModal({ onClose }: FormulaModalProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] max-w-[90vw] max-h-[85vh] overflow-y-auto scrollbar-thin border-4 rounded-xl p-4 sm:p-6 z-[10000]"
        style={{
          backgroundColor: colors.backgroundCard,
          borderColor: colors.border,
          boxShadow: `8px 8px 0px 0px ${shadowColor}`,
        }}
      >
        <div
          className="flex justify-between items-center mb-4 border-b-4 pb-3"
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
              <Info
                className="w-5 h-5"
                style={{ color: colors.textOnPrimary }}
              />
            </div>
            <h4
              className="text-base sm:text-lg font-bold"
              style={{ color: colors.text }}
            >
              Weightage Calculation Explained
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 flex items-center justify-center transition-colors"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.secondary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.accent
            }}
          >
            <X className="w-4 h-4" style={{ color: colors.textOnAccent }} />
          </button>
        </div>

        <div
          className="text-xs sm:text-sm space-y-4"
          style={{ color: isLight ? lightTheme.text : darkTheme.textMuted }}
        >
          <p style={{ color: colors.text }}>
            The weightage percentage represents the relative importance of each
            topic based on both the{" "}
            <span className="font-medium" style={{ color: colors.primary }}>
              frequency of questions
            </span>{" "}
            and{" "}
            <span className="font-medium" style={{ color: colors.primary }}>
              total marks
            </span>{" "}
            allocated to that topic in previous exams.
          </p>

          <div
            className="rounded-xl p-3 sm:p-4 border space-y-3"
            style={{
              backgroundColor: colors.backgroundMuted,
              borderColor: `${colors.border}10`,
            }}
          >
            <h5 className="font-medium" style={{ color: colors.text }}>
              Formula:
            </h5>

            <div>
              <p className="mb-2">1. For each topic, calculate Raw Score:</p>
              <div
                className="pl-4 font-mono p-2 sm:p-3 rounded text-center"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                Raw Score = Total Marks × Question Frequency
              </div>
            </div>

            <div>
              <p className="mb-2">2. Calculate initial weightage:</p>
              <div
                className="pl-4 font-mono p-2 sm:p-3 rounded text-center"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                Initial Weightage = (Topic Raw Score ÷ Total Raw Score) × 100
              </div>
            </div>

            <div>
              <p className="mb-2">3. Apply minimum weightage rule:</p>
              <div
                className="pl-4 font-mono p-2 sm:p-3 rounded text-center"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                Final Weightage = max(1%, Initial Weightage) for topics with
                questions
              </div>
              <p
                className="mt-1 text-xs"
                style={{ color: isLight ? "#666" : "#aaa" }}
              >
                Topics with no questions always get 0%
              </p>
            </div>

            <div>
              <p className="mb-2">4. Balance the total:</p>
              <div
                className="pl-4 font-mono p-2 sm:p-3 rounded text-center"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                Adjust weightages so they sum to exactly 100%
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-3 sm:p-4 border"
            style={{
              backgroundColor: colors.backgroundMuted,
              borderColor: `${colors.border}10`,
            }}
          >
            <h5 className="font-medium mb-3" style={{ color: colors.text }}>
              Example:
            </h5>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 sm:gap-3 text-xs">
                <div className="font-medium" style={{ color: colors.primary }}>
                  Topic
                </div>
                <div className="font-medium" style={{ color: colors.primary }}>
                  Questions
                </div>
                <div className="font-medium" style={{ color: colors.primary }}>
                  Total Marks
                </div>
                <div className="font-medium" style={{ color: colors.primary }}>
                  Raw Score
                </div>

                <div
                  className="border-t pt-2"
                  style={{ borderColor: isLight ? "#ccc" : "#555" }}
                >
                  Thermodynamics
                </div>
                <div
                  className="border-t pt-2 text-center"
                  style={{ borderColor: isLight ? "#ccc" : "#555" }}
                >
                  3
                </div>
                <div
                  className="border-t pt-2 text-center"
                  style={{ borderColor: isLight ? "#ccc" : "#555" }}
                >
                  15
                </div>
                <div
                  className="border-t pt-2 text-center"
                  style={{ borderColor: isLight ? "#ccc" : "#555" }}
                >
                  45
                </div>

                <div>Heat Transfer</div>
                <div className="text-center">2</div>
                <div className="text-center">10</div>
                <div className="text-center">20</div>

                <div>Combustion</div>
                <div className="text-center">1</div>
                <div className="text-center">5</div>
                <div className="text-center">5</div>
              </div>

              <div className="text-xs">
                <p>Total Raw Score = 45 + 20 + 5 = 70</p>
                <p className="mt-2">Initial weightage calculations:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    Thermodynamics: (45 ÷ 70) × 100 = 64.29% → rounded to{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      64%
                    </span>
                  </li>
                  <li>
                    Heat Transfer: (20 ÷ 70) × 100 = 28.57% → rounded to{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      29%
                    </span>
                  </li>
                  <li>
                    Combustion: (5 ÷ 70) × 100 = 7.14% → rounded to{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      7%
                    </span>
                  </li>
                </ul>
                <p className="mt-2">Special cases:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    If a topic has questions but would calculate to less than
                    1%, it still receives{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      at least 1%
                    </span>
                  </li>
                  <li>
                    If no topics have questions, all topics receive{" "}
                    <span
                      className="font-medium"
                      style={{ color: colors.primary }}
                    >
                      0%
                    </span>
                  </li>
                  <li>
                    Final adjustments ensure the percentages sum to exactly 100%
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2">This approach ensures that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>More frequent questions get higher weightage</li>
              <li>Higher mark allocation get higher weightage</li>
              <li>Every topic with questions shows a non-zero weightage</li>
              <li>Topics with no questions have zero weightage</li>
              <li>
                The total weightage across all topics always adds up to 100%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
