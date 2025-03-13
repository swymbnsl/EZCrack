"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  ChevronDown,
  Repeat,
  FileQuestion,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { UnitCard } from "@/components/units/UnitCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import axios from "axios";
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal";

const formatExamType = (examType: string) => {
  const type = examType.toLowerCase();
  return type === "midterm"
    ? "Midterm"
    : type === "endterm"
    ? "Endterm"
    : examType;
};

interface BaseRepeatedQuestion {
  frequency: number;
  questions: {
    question: string;
    year: string;
    examType: string;
  }[];
}

interface ConceptBasedQuestion extends BaseRepeatedQuestion {
  concept: string;
}

interface PatternBasedQuestion extends BaseRepeatedQuestion {
  pattern: string;
}

interface RepeatedQuestions {
  conceptBased: ConceptBasedQuestion[];
  patternBased: PatternBasedQuestion[];
}

interface Unit {
  _id: string;
  number: number;
  topics: string[];
  repeatedQuestions?: RepeatedQuestions;
  formulaSheet?: {
    content: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Question {
  _id: string;
  question: string;
  marks: number;
  year: number;
  topic: string;
  unit: number;
  midsem: boolean;
}

interface Subject {
  _id: string;
  name: string;
  semester: number;
  code?: string;
  credits?: number;
}

type ViewMode = "units" | "yearwise" | "repeated";
type ExamFilter = "all" | "midterm" | "endterm";
type RepeatedType = "concept" | "pattern";

export default function UnitsPage() {
  const params = useParams();
  const { branchId, semId, subjectId } = params;
  const [units, setUnits] = useState<Unit[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("units");
  const [examFilter, setExamFilter] = useState<ExamFilter>("all");
  const [repeatedType, setRepeatedType] = useState<RepeatedType>("concept");
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {}
  );
  const [showFormulaSheetModal, setShowFormulaSheetModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, subjectResponse, questionsResponse] =
          await Promise.all([
            axios.get(`/api/units?subject_id=${subjectId}`),
            axios.get(`/api/subjects/${subjectId}`),
            axios.get(`/api/questions/subject/${subjectId}`),
          ]);

        const [unitsData, subjectData, questionsData] = [
          unitsResponse.data,
          subjectResponse.data,
          questionsResponse.data,
        ];

        setUnits(unitsData.units);
        setSubject(subjectData.subject);
        setQuestions(questionsData.foundQuestions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subjectId) {
      fetchData();
    }
  }, [subjectId]);

  // Filter questions based on exam type
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      if (examFilter === "all") return true;
      if (examFilter === "midterm") return question.midsem;
      return !question.midsem; // endterm
    });
  }, [questions, examFilter]);

  // Group filtered questions by year and unit
  const questionsByYear = useMemo(() => {
    return filteredQuestions.reduce((acc, question) => {
      const year = question.year;
      if (!acc[year]) {
        acc[year] = {
          total: 0,
          byUnit: {} as Record<number, Question[]>,
        };
      }
      if (!acc[year].byUnit[question.unit]) {
        acc[year].byUnit[question.unit] = [];
      }
      acc[year].byUnit[question.unit].push(question);
      acc[year].total++;
      return acc;
    }, {} as Record<number, { total: number; byUnit: Record<number, Question[]> }>);
  }, [filteredQuestions]);

  // Sort years in descending order
  const sortedYears = useMemo(() => {
    return Object.keys(questionsByYear)
      .map(Number)
      .sort((a, b) => b - a);
  }, [questionsByYear]);

  // Toggle year expansion
  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || "";
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || "";

  // Get total questions count for the current filter
  const totalFilteredQuestions = filteredQuestions.length;

  // Pluralize years correctly
  const yearText = sortedYears.length === 1 ? "year" : "years";

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen sm:h-screen flex flex-col">
        <Header
          branchId={parsedBranchId}
          semId={parsedSemId}
          backLink={`/branch/${parsedBranchId}/semester/${parsedSemId}`}
          backText="Back to Subjects"
          title={subject?.name || "Loading..."}
          subtitle={
            viewMode === "units"
              ? `${units.length} units to explore`
              : `${totalFilteredQuestions} questions across ${sortedYears.length} ${yearText}`
          }
          stats={{
            primary: {
              value: viewMode === "units" ? units.length : sortedYears.length,
              label: viewMode === "units" ? "Units" : yearText,
            },
            secondary: {
              value:
                viewMode === "units"
                  ? units.reduce((acc, unit) => acc + unit.topics.length, 0)
                  : totalFilteredQuestions,
              label: viewMode === "units" ? "Topics" : "Questions",
            },
          }}
        />

        <div className="flex-1 overflow-visible sm:overflow-hidden mt-2 sm:mt-0 bg-gradient-to-b from-gray-950 to-black sm:bg-none">
          <div className="sm:h-full sm:overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
            <div className="p-3 sm:p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading content..." />
              ) : (
                <>
                  <div className="mb-4 sm:mb-8">
                    <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-2xl p-1 sm:p-1.5 border border-gray-700/50">
                      <div className="flex flex-row">
                        <button
                          onClick={() => setViewMode("units")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                            viewMode === "units"
                              ? "bg-purple-500/20 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm sm:text-base">
                            Unit-wise
                          </span>
                        </button>
                        <button
                          onClick={() => setViewMode("yearwise")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                            viewMode === "yearwise"
                              ? "bg-purple-500/20 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm sm:text-base">
                            Year-wise
                          </span>
                        </button>
                        <button
                          onClick={() => setViewMode("repeated")}
                          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                            viewMode === "repeated"
                              ? "bg-purple-500/20 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <Repeat className="w-4 h-4" />
                          <span className="text-sm sm:text-base">Repeated</span>
                        </button>
                      </div>
                    </div>

                    {viewMode === "yearwise" && (
                      <div className="mt-2 sm:mt-4 max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-2xl p-1 sm:p-1.5 border border-gray-700/50">
                        <div className="flex flex-row">
                          <button
                            onClick={() => setExamFilter("all")}
                            className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                              examFilter === "all"
                                ? "bg-amber-500/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                            }`}
                          >
                            <span className="text-sm sm:text-base">All</span>
                          </button>
                          <button
                            onClick={() => setExamFilter("midterm")}
                            className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                              examFilter === "midterm"
                                ? "bg-amber-500/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                            }`}
                          >
                            <span className="text-sm sm:text-base">Mid</span>
                          </button>
                          <button
                            onClick={() => setExamFilter("endterm")}
                            className={`flex-1 flex items-center justify-center px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                              examFilter === "endterm"
                                ? "bg-amber-500/20 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                            }`}
                          >
                            <span className="text-sm sm:text-base">End</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {viewMode === "units" ? (
                      <motion.div
                        key="units"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
                      >
                        {units.length > 0 ? (
                          units.map((unit: Unit, index: number) => (
                            <UnitCard
                              key={unit._id}
                              unit={unit}
                              index={index}
                              branchId={parsedBranchId}
                              semId={parsedSemId}
                              subjectId={subjectId as string}
                            />
                          ))
                        ) : (
                          <div className="col-span-full">
                            <EmptyState
                              icon={BookOpen}
                              title="No Units Available"
                              description="This subject doesn't have any units yet. Check back later for updates."
                            />
                          </div>
                        )}
                      </motion.div>
                    ) : viewMode === "yearwise" ? (
                      <motion.div
                        key="yearwise"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto space-y-6"
                      >
                        {sortedYears.length > 0 ? (
                          sortedYears.map((year) => (
                            <div
                              key={year}
                              className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
                            >
                              <button
                                onClick={() => toggleYear(year)}
                                className="w-full px-3 sm:px-8 py-3 sm:py-5 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                              >
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-white">
                                      {year}
                                    </h2>
                                    <span className="text-xs sm:text-sm text-purple-400 bg-purple-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                      {questionsByYear[year].total} questions
                                    </span>
                                  </div>
                                </div>
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                    expandedYears[year] ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                              <AnimatePresence>
                                {expandedYears[year] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-gray-700/50"
                                  >
                                    <div className="px-3 sm:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
                                      {Object.entries(
                                        questionsByYear[year].byUnit
                                      )
                                        .sort(
                                          ([a], [b]) => Number(a) - Number(b)
                                        )
                                        .map(([unit, questions]) => (
                                          <div key={unit}>
                                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                                              </div>
                                              <h3 className="text-base sm:text-lg font-medium text-white">
                                                Unit {unit}
                                              </h3>
                                              <span className="text-xs sm:text-sm text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                                {questions.length} questions
                                              </span>
                                            </div>
                                            <div className="space-y-3 sm:space-y-4">
                                              {questions.map(
                                                (question, qIndex) => (
                                                  <motion.div
                                                    key={question._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                      delay: qIndex * 0.05,
                                                    }}
                                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 sm:p-5"
                                                  >
                                                    <div className="flex flex-col gap-3">
                                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                                        <span className="text-xs sm:text-sm font-medium text-purple-400 bg-purple-500/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full break-words">
                                                          {question.topic}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                          <div className="hidden sm:flex items-center gap-2">
                                                            <span className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full">
                                                              {question.marks}{" "}
                                                              marks
                                                            </span>
                                                            <span className="text-xs sm:text-sm font-medium text-amber-400 bg-amber-500/10 px-2 sm:px-3 py-0.5 sm:py-1.5 rounded-full">
                                                              {question.midsem
                                                                ? "Midterm"
                                                                : "Endterm"}
                                                            </span>
                                                          </div>
                                                          <div className="sm:hidden flex items-center text-xs divide-x divide-gray-700">
                                                            <span className="font-medium text-emerald-400 pr-2">
                                                              {question.marks}m
                                                            </span>
                                                            <span className="font-medium text-amber-400 pl-2">
                                                              {question.midsem
                                                                ? "Mid"
                                                                : "End"}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <p className="text-sm sm:text-base text-gray-200">
                                                        {question.question}
                                                      </p>
                                                    </div>
                                                  </motion.div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        ) : (
                          <EmptyState
                            icon={Calendar}
                            title="No Questions Available"
                            description={
                              examFilter !== "all"
                                ? `No ${examFilter} questions found. Try selecting 'All Exams'.`
                                : "No questions available for this subject yet."
                            }
                            iconColor="text-purple-400"
                          />
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="repeated"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto space-y-6"
                      >
                        <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-2xl p-1 sm:p-1.5 border border-gray-700/50">
                          <div className="flex flex-row">
                            <button
                              onClick={() => setRepeatedType("concept")}
                              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                                repeatedType === "concept"
                                  ? "bg-purple-500/20 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                              }`}
                            >
                              <BookOpen className="w-4 h-4" />
                              <span className="text-sm sm:text-base">
                                Concept Based
                              </span>
                            </button>
                            <button
                              onClick={() => setRepeatedType("pattern")}
                              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-md sm:rounded-xl transition-all ${
                                repeatedType === "pattern"
                                  ? "bg-amber-500/20 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                              }`}
                            >
                              <Repeat className="w-4 h-4" />
                              <span className="text-sm sm:text-base">
                                Pattern Based
                              </span>
                            </button>
                          </div>
                        </div>

                        <AnimatePresence mode="wait">
                          {repeatedType === "concept" ? (
                            <motion.div
                              key="concept"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="space-y-8"
                            >
                              {units.some(
                                (unit) =>
                                  unit.repeatedQuestions?.conceptBased &&
                                  unit.repeatedQuestions.conceptBased.length > 0
                              ) ? (
                                units.map((unit) => {
                                  const conceptQuestions =
                                    unit.repeatedQuestions?.conceptBased;
                                  if (!conceptQuestions?.length) return null;

                                  return (
                                    <div
                                      key={`unit-${unit._id}`}
                                      className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
                                    >
                                      <div className="px-8 py-6">
                                        <div className="flex items-center gap-3 mb-6">
                                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-purple-400" />
                                          </div>
                                          <div>
                                            <h3 className="text-2xl font-semibold text-white">
                                              Unit {unit.number}
                                            </h3>
                                            <span className="text-sm text-purple-400">
                                              {conceptQuestions.length} repeated
                                              concepts
                                            </span>
                                          </div>
                                        </div>

                                        <div className="space-y-6">
                                          {conceptQuestions.map(
                                            (repeatedQuestion, index) => (
                                              <div
                                                key={`concept-${unit._id}-${index}`}
                                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                                              >
                                                <div className="p-3 sm:p-5 bg-purple-500/10 border-b border-purple-500/20">
                                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                                    <h4 className="text-base sm:text-lg font-medium text-purple-400 break-words">
                                                      {repeatedQuestion.concept}
                                                    </h4>
                                                    <div className="flex items-center text-xs sm:text-sm text-purple-400">
                                                      <span className="sm:hidden font-medium">
                                                        ×
                                                        {
                                                          repeatedQuestion.frequency
                                                        }
                                                      </span>
                                                      <span className="hidden sm:inline bg-purple-500/20 px-3 py-1.5 rounded-full">
                                                        Repeated{" "}
                                                        {
                                                          repeatedQuestion.frequency
                                                        }{" "}
                                                        times
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="p-5 space-y-4">
                                                  {repeatedQuestion.questions.map(
                                                    (q, qIndex) => (
                                                      <div
                                                        key={qIndex}
                                                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5"
                                                      >
                                                        <div className="flex flex-col gap-3">
                                                          <div className="flex items-center justify-between">
                                                            <div className="hidden sm:block">
                                                              <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                                                                {formatExamType(
                                                                  q.examType
                                                                )}
                                                              </span>
                                                            </div>
                                                            <div className="hidden sm:block">
                                                              <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                                {q.year}
                                                              </span>
                                                            </div>
                                                            <div className="sm:hidden flex items-center text-xs divide-x divide-gray-700 w-full">
                                                              <span className="font-medium text-amber-400 pr-2">
                                                                {formatExamType(
                                                                  q.examType
                                                                ) === "Midterm"
                                                                  ? "Mid"
                                                                  : "End"}
                                                              </span>
                                                              <span className="font-medium text-emerald-400 pl-2">
                                                                {q.year}
                                                              </span>
                                                            </div>
                                                          </div>
                                                          <p className="text-gray-200">
                                                            {q.question}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <EmptyState
                                  icon={Repeat}
                                  title="No Repeated Concepts"
                                  description="There are no repeated concept-based questions for this subject yet."
                                  iconColor="text-purple-400"
                                />
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="pattern"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="space-y-8"
                            >
                              {units.some(
                                (unit) =>
                                  unit.repeatedQuestions?.patternBased &&
                                  unit.repeatedQuestions.patternBased.length > 0
                              ) ? (
                                units.map((unit) => {
                                  const patternQuestions =
                                    unit.repeatedQuestions?.patternBased;
                                  if (!patternQuestions?.length) return null;

                                  return (
                                    <div
                                      key={`unit-${unit._id}`}
                                      className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
                                    >
                                      <div className="px-8 py-6">
                                        <div className="flex items-center gap-3 mb-6">
                                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                            <Repeat className="w-6 h-6 text-amber-400" />
                                          </div>
                                          <div>
                                            <h3 className="text-2xl font-semibold text-white">
                                              Unit {unit.number}
                                            </h3>
                                            <span className="text-sm text-amber-400">
                                              {patternQuestions.length} repeated
                                              patterns
                                            </span>
                                          </div>
                                        </div>

                                        <div className="space-y-6">
                                          {patternQuestions.map(
                                            (repeatedQuestion, index) => (
                                              <div
                                                key={`pattern-${unit._id}-${index}`}
                                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                                              >
                                                <div className="p-3 sm:p-5 bg-amber-500/10 border-b border-amber-500/20">
                                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                                    <h4 className="text-base sm:text-lg font-medium text-amber-400 break-words">
                                                      {repeatedQuestion.pattern}
                                                    </h4>
                                                    <div className="flex items-center text-xs sm:text-sm text-amber-400">
                                                      <span className="sm:hidden font-medium">
                                                        ×
                                                        {
                                                          repeatedQuestion.frequency
                                                        }
                                                      </span>
                                                      <span className="hidden sm:inline bg-amber-500/20 px-3 py-1.5 rounded-full">
                                                        Repeated{" "}
                                                        {
                                                          repeatedQuestion.frequency
                                                        }{" "}
                                                        times
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>

                                                <div className="p-5 space-y-4">
                                                  {repeatedQuestion.questions.map(
                                                    (q, qIndex) => (
                                                      <div
                                                        key={qIndex}
                                                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5"
                                                      >
                                                        <div className="flex flex-col gap-3">
                                                          <div className="flex items-center justify-between">
                                                            <div className="hidden sm:block">
                                                              <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                                                                {formatExamType(
                                                                  q.examType
                                                                )}
                                                              </span>
                                                            </div>
                                                            <div className="hidden sm:block">
                                                              <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                                {q.year}
                                                              </span>
                                                            </div>
                                                            <div className="sm:hidden flex items-center text-xs divide-x divide-gray-700 w-full">
                                                              <span className="font-medium text-amber-400 pr-2">
                                                                {formatExamType(
                                                                  q.examType
                                                                ) === "Midterm"
                                                                  ? "Mid"
                                                                  : "End"}
                                                              </span>
                                                              <span className="font-medium text-emerald-400 pl-2">
                                                                {q.year}
                                                              </span>
                                                            </div>
                                                          </div>
                                                          <p className="text-gray-200">
                                                            {q.question}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <EmptyState
                                  icon={Repeat}
                                  title="No Repeated Patterns"
                                  description="There are no repeated pattern-based questions for this subject yet."
                                  iconColor="text-amber-400"
                                />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        <FormulaSheetModal
          isOpen={showFormulaSheetModal}
          onClose={() => {
            setShowFormulaSheetModal(false);
            setSelectedUnit(null);
          }}
          formulaSheet={selectedUnit?.formulaSheet || null}
          unitNumber={selectedUnit?.number || 0}
        />
      </div>
    </PageWrapper>
  );
}
