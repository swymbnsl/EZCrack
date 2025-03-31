import { motion } from "framer-motion";
import { ChevronLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ContributorBadge } from "@/components/shared/ContributorBadge";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  branchId: string | string[];
  semId: string;
  backLink: string;
  backText: string;
  title: string;
  subtitle: string;
  stats: {
    primary: { value: number | string; label: string };
    secondary: { value: number | string; label: string };
  };
  showContributor?: boolean;
  showWeightageInfo?: boolean;
  contributor?: {
    name: string;
    branch: string;
    semester: number;
    avatar: string;
    linkedinUrl?: string;
    subject_ids: {
      _id: string;
      name: string;
    }[];
  };
}

function FormulaModal({ onClose }: { onClose: () => void }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Use useEffect to handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] max-w-[90vw] max-h-[85vh] overflow-y-auto ${
        isLight 
          ? "bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" 
          : "bg-[#1E1E1E] border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]"
      } border-4 rounded-xl p-4 sm:p-6 z-[10000] `}>
        <div className={`flex justify-between items-center mb-4 border-b-4 pb-3 ${isLight ? "border-black" : "border-white"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${
              isLight 
                ? "bg-[#76ABAE] border-black" 
                : "bg-[#4ECDC4] border-white"
            } border-3 flex items-center justify-center`}>
              <Info className={`w-5 h-5 ${isLight ? "text-black" : "text-[#121212]"}`} />
            </div>
            <h4 className={`text-base sm:text-lg font-bold ${isLight ? "text-black" : "text-white"}`}>
              Weightage Calculation Explained
            </h4>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 ${
              isLight 
                ? "bg-[#FF7B54] border-black hover:bg-[#FFD56B]" 
                : "bg-[#FF6B6B] border-white hover:bg-[#4ECDC4]"
            } border-2 flex items-center justify-center transition-colors`}
          >
            <X className={`w-4 h-4 ${isLight ? "text-black" : "text-[#121212]"}`} />
          </button>
        </div>

        <div className={`text-xs sm:text-sm ${isLight ? "text-[#2D2A32]" : "text-gray-300"} space-y-4 overflow-y-auto scrollbar-thin ${
            isLight ? "scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40" : "scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40"
          }`}>
          <p className={isLight ? "text-black" : "text-white"}>
            The weightage percentage represents the relative importance of each
            topic based on both the{" "}
            <span className={isLight ? "text-[#76ABAE] font-medium" : "text-purple-400"}>frequency of questions</span> and{" "}
            <span className={isLight ? "text-[#76ABAE] font-medium" : "text-purple-400"}>total marks</span> allocated to
            that topic in previous exams.
          </p>

          <div className={`${
            isLight ? "bg-[#F5F5F5] border-black/10" : "bg-gray-800/50 border-gray-700/50"
          } rounded-xl p-3 sm:p-4 border space-y-3`}>
            <h5 className={`font-medium ${isLight ? "text-black" : "text-white"}`}>Formula:</h5>

            <div>
              <p className="mb-2">1. For each topic, calculate Raw Score:</p>
              <div className={`pl-4 font-mono ${
                isLight ? "bg-[#76ABAE]/10" : "bg-purple-500/10"
              } p-2 sm:p-3 rounded text-center`}>
                Raw Score = Total Marks × Question Frequency
              </div>
            </div>

            <div>
              <p className="mb-2">2. Calculate initial weightage:</p>
              <div className={`pl-4 font-mono ${
                isLight ? "bg-[#76ABAE]/10" : "bg-purple-500/10"
              } p-2 sm:p-3 rounded text-center`}>
                Initial Weightage = (Topic Raw Score ÷ Total Raw Score) × 100
              </div>
            </div>

            <div>
              <p className="mb-2">3. Apply minimum weightage rule:</p>
              <div className={`pl-4 font-mono ${
                isLight ? "bg-[#76ABAE]/10" : "bg-purple-500/10"
              } p-2 sm:p-3 rounded text-center`}>
                Final Weightage = max(1%, Initial Weightage) for topics with
                questions
              </div>
              <p className={`mt-1 text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Topics with no questions always get 0%
              </p>
            </div>

            <div>
              <p className="mb-2">4. Balance the total:</p>
              <div className={`pl-4 font-mono ${
                isLight ? "bg-[#76ABAE]/10" : "bg-purple-500/10"
              } p-2 sm:p-3 rounded text-center`}>
                Adjust weightages so they sum to exactly 100%
              </div>
            </div>
          </div>

          <div className={`${
            isLight ? "bg-[#F5F5F5] border-black/10" : "bg-gray-800/50 border-gray-700/50"
          } rounded-xl p-3 sm:p-4 border`}>
            <h5 className={`font-medium ${isLight ? "text-black" : "text-white"} mb-3`}>Example:</h5>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 sm:gap-3 text-xs">
                <div className={`font-medium ${isLight ? "text-[#76ABAE]" : "text-purple-400"}`}>Topic</div>
                <div className={`font-medium ${isLight ? "text-[#76ABAE]" : "text-purple-400"}`}>Questions</div>
                <div className={`font-medium ${isLight ? "text-[#76ABAE]" : "text-purple-400"}`}>Total Marks</div>
                <div className={`font-medium ${isLight ? "text-[#76ABAE]" : "text-purple-400"}`}>Raw Score</div>

                <div className={`border-t ${isLight ? "border-gray-300" : "border-gray-700"} pt-2`}>
                  Thermodynamics
                </div>
                <div className={`border-t ${isLight ? "border-gray-300" : "border-gray-700"} pt-2 text-center`}>
                  3
                </div>
                <div className={`border-t ${isLight ? "border-gray-300" : "border-gray-700"} pt-2 text-center`}>
                  15
                </div>
                <div className={`border-t ${isLight ? "border-gray-300" : "border-gray-700"} pt-2 text-center`}>
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
                    <span className={`${isLight ? "text-[#76ABAE]" : "text-purple-400"} font-medium`}>64%</span>
                  </li>
                  <li>
                    Heat Transfer: (20 ÷ 70) × 100 = 28.57% → rounded to{" "}
                    <span className={`${isLight ? "text-[#76ABAE]" : "text-purple-400"} font-medium`}>29%</span>
                  </li>
                  <li>
                    Combustion: (5 ÷ 70) × 100 = 7.14% → rounded to{" "}
                    <span className={`${isLight ? "text-[#76ABAE]" : "text-purple-400"} font-medium`}>7%</span>
                  </li>
                </ul>
                <p className="mt-2">Special cases:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    If a topic has questions but would calculate to less than
                    1%, it still receives{" "}
                    <span className={`${isLight ? "text-[#76ABAE]" : "text-purple-400"} font-medium`}>
                      at least 1%
                    </span>
                  </li>
                  <li>
                    If no topics have questions, all topics receive{" "}
                    <span className={`${isLight ? "text-[#76ABAE]" : "text-purple-400"} font-medium`}>0%</span>
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
  );
}

function WeightageInfo() {
  const [showFormula, setShowFormula] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`${
      isLight 
        ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
        : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
    } border-4 p-3 sm:p-4`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowFormula(true)}
            className={`w-10 h-10 sm:w-12 sm:h-12 ${
              isLight 
                ? "bg-[#76ABAE] border-black" 
                : "bg-[#4ECDC4] border-white"
            } border-3  flex items-center justify-center`}
          >
            <Info className={`w-5 h-5 sm:w-6 sm:h-6 ${isLight ? "text-black" : "text-[#121212]"}`} />
          </button>

          {/* Modal rendered at document.body level */}
          {showFormula && (
            <FormulaModal onClose={() => setShowFormula(false)} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <h3 className={`font-bold text-sm sm:text-base truncate ${isLight ? "text-black" : "text-white"}`}>
              Weightage Calculation
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm">

            <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 ${
              isLight 
                ? "bg-[#FFD56B] text-black border-black" 
                : "bg-[#FFE66D] text-[#121212] border-white"
            } border-2 truncate`}>
              Based on marks and frequency
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({
  branchId,
  semId,
  backLink,
  backText,
  title,
  subtitle,
  stats,
  showContributor = true,
  showWeightageInfo = false,
  contributor,
}: HeaderProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`border-b-4 ${isLight ? "border-black bg-[#FFFFFA]" : "border-white bg-[#121212]"} shadow-lg relative z-20`}>
      <div className="max-w-[2000px] mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <Link
              href={backLink}
              className={`inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${isLight ? "text-black hover:text-[#FF7B54]" : "text-white hover:text-[#4ECDC4]"} transition-colors group`}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {backText}
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                isLight 
                  ? "bg-[#FFD56B] text-black border-black" 
                  : "bg-[#4ECDC4] text-[#121212] border-white"
              } border-2`}>
                {Array.isArray(branchId)
                  ? branchId[0].toUpperCase()
                  : branchId?.toUpperCase()}
              </span>
              <span className={`text-xs sm:text-sm px-2 sm:px-3 py-1 ${
                isLight 
                  ? "bg-[#76ABAE] text-black border-black" 
                  : "bg-[#FFE66D] text-[#121212] border-white"
              } border-2`}>
                Sem {semId}
              </span>
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 relative inline-block ${
                  isLight ? "text-black" : "text-white"
                }`}>
                  <motion.span 
                    className={`absolute -inset-2 -z-10 `}
                    initial={{ rotate: 5 }}
                    animate={{ rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  ></motion.span>
                  {title}
                </h1>
                <p className={`${
                  isLight ? "text-[#2D2A32]" : "text-gray-300"
                } text-sm sm:text-base md:text-lg flex items-center gap-2`}>
                  {subtitle}
                </p>
              </div>
              <div className="block sm:hidden">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {showWeightageInfo && (
                <div className="w-full sm:w-auto">
                  <WeightageInfo />
                </div>
              )}

              {showContributor && contributor && (
                <div className="w-full sm:w-auto">
                  <ContributorBadge contributor={contributor} />
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <StatCard
                  value={stats.primary.value}
                  label={stats.primary.label}
                  isLight={isLight}
                />
                <StatCard
                  value={stats.secondary.value}
                  label={stats.secondary.label}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ value, label, isLight }: { value: number | string; label: string; isLight: boolean }) {
  return (
    <div className={`flex-1 sm:flex-none sm:w-28 md:w-32 h-[70px] sm:h-[80px] md:h-[88px] text-center px-2 sm:px-4 py-2 sm:py-3 ${
      isLight 
        ? "bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
        : "bg-[#1E1E1E] border-white text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
    } border-4  flex flex-col items-center justify-center`}>
      <div className={`text-xl sm:text-2xl font-bold ${
        isLight ? "text-[#FF7B54]" : "text-[#4ECDC4]"
      }`}>
        {value}
      </div>
      <div className={`text-xs sm:text-sm ${
        isLight ? "text-[#2D2A32]" : "text-gray-400"
      }`}>{label}</div>
    </div>
  );
}
