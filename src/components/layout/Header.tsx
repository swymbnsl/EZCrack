import { motion } from "framer-motion";
import { ChevronLeft, Info, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ContributorBadge } from "@/components/shared/ContributorBadge";

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
}

function FormulaModal({ onClose }: { onClose: () => void }) {
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] max-w-[90vw] max-h-[85vh] overflow-y-auto bg-gray-900 border border-purple-500/50 rounded-xl p-4 sm:p-6 shadow-2xl z-[10000] scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base sm:text-lg font-medium text-purple-400">
            Weightage Calculation Explained
          </h4>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-gray-300 space-y-4">
          <p className="text-white">
            The weightage percentage represents the relative importance of each
            topic based on both the{" "}
            <span className="text-purple-400">frequency of questions</span> and{" "}
            <span className="text-purple-400">total marks</span> allocated to
            that topic in previous exams.
          </p>

          <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50 space-y-3">
            <h5 className="font-medium text-white">Formula:</h5>

            <div>
              <p className="mb-2">1. For each topic, calculate Raw Score:</p>
              <div className="pl-4 font-mono bg-purple-500/10 p-2 sm:p-3 rounded text-center">
                Raw Score = Total Marks × Question Frequency
              </div>
            </div>

            <div>
              <p className="mb-2">2. Calculate initial weightage:</p>
              <div className="pl-4 font-mono bg-purple-500/10 p-2 sm:p-3 rounded text-center">
                Initial Weightage = (Topic Raw Score ÷ Total Raw Score) × 100
              </div>
            </div>

            <div>
              <p className="mb-2">3. Apply minimum weightage rule:</p>
              <div className="pl-4 font-mono bg-purple-500/10 p-2 sm:p-3 rounded text-center">
                Final Weightage = max(1%, Initial Weightage) for topics with
                questions
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Topics with no questions always get 0%
              </p>
            </div>

            <div>
              <p className="mb-2">4. Balance the total:</p>
              <div className="pl-4 font-mono bg-purple-500/10 p-2 sm:p-3 rounded text-center">
                Adjust weightages so they sum to exactly 100%
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
            <h5 className="font-medium text-white mb-3">Example:</h5>

            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,auto,auto] gap-2 sm:gap-3 text-xs">
                <div className="font-medium text-purple-400">Topic</div>
                <div className="font-medium text-purple-400">Questions</div>
                <div className="font-medium text-purple-400">Total Marks</div>
                <div className="font-medium text-purple-400">Raw Score</div>

                <div className="border-t border-gray-700 pt-2">
                  Thermodynamics
                </div>
                <div className="border-t border-gray-700 pt-2 text-center">
                  3
                </div>
                <div className="border-t border-gray-700 pt-2 text-center">
                  15
                </div>
                <div className="border-t border-gray-700 pt-2 text-center">
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
                    <span className="text-purple-400 font-medium">64%</span>
                  </li>
                  <li>
                    Heat Transfer: (20 ÷ 70) × 100 = 28.57% → rounded to{" "}
                    <span className="text-purple-400 font-medium">29%</span>
                  </li>
                  <li>
                    Combustion: (5 ÷ 70) × 100 = 7.14% → rounded to{" "}
                    <span className="text-purple-400 font-medium">7%</span>
                  </li>
                </ul>
                <p className="mt-2">Special cases:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    If a topic has questions but would calculate to less than
                    1%, it still receives{" "}
                    <span className="text-purple-400 font-medium">
                      at least 1%
                    </span>
                  </li>
                  <li>
                    If no topics have questions, all topics receive{" "}
                    <span className="text-purple-400 font-medium">0%</span>
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

  return (
    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            onClick={() => setShowFormula(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-purple-500/20 hover:border-purple-500/40 transition-colors flex items-center justify-center"
          >
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </button>

          {/* Modal rendered at document.body level */}
          {showFormula && (
            <FormulaModal onClose={() => setShowFormula(false)} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white text-sm sm:text-base">
              Weightage Calculation
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
            <span className="inline-flex items-center gap-1 bg-gray-800/50 rounded-full">
              Based on question frequency and marks
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
}: HeaderProps) {
  // Demo contributor data
  const contributor = {
    name: "Swayam Bansal",
    branch: "ECE",
    semester: 2,
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Valentina",
    linkedinUrl: "https://linkedin.com/in/swymbnsl",
  };

  return (
    <div className="border-b-2 border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-md shadow-lg shadow-black/30 sticky top-0 sm:relative sm:shadow-none sm:border-b sm:border-gray-800 sm:bg-gray-900/50 sm:backdrop-blur-sm z-20">
      <div className="max-w-[2000px] mx-auto p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <Link
              href={backLink}
              className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-gray-400 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {backText}
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-800/80 rounded-full border border-gray-700/50 text-gray-300">
                {Array.isArray(branchId)
                  ? branchId[0].toUpperCase()
                  : branchId?.toUpperCase()}
              </span>
              <span className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-800/80 rounded-full border border-gray-700/50 text-gray-300">
                Sem {semId}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                {title}
              </h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg flex items-center gap-2">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {showWeightageInfo && (
                <div className="w-full sm:w-auto">
                  <WeightageInfo />
                </div>
              )}

              {showContributor && (
                <div className="w-full sm:w-auto">
                  <ContributorBadge contributor={contributor} />
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
                <StatCard
                  value={stats.primary.value}
                  label={stats.primary.label}
                />
                <StatCard
                  value={stats.secondary.value}
                  label={stats.secondary.label}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex-1 sm:flex-none sm:w-28 md:w-32 h-[70px] sm:h-[80px] md:h-[88px] text-center px-2 sm:px-4 py-2 sm:py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center">
      <div className="text-xl sm:text-2xl font-bold text-purple-400">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-400">{label}</div>
    </div>
  );
}
