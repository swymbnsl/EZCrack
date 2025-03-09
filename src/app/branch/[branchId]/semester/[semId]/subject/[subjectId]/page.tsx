"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BookOpen, Calendar, ChevronRight, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { UnitCard } from "@/components/units/UnitCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { QuestionCard } from "@/components/questions/QuestionCard";
import axios from "axios";

interface Unit {
  _id: string;
  number: number;
  topics: string[];
}

interface Question {
  _id: string;
  question: string;
  marks: number;
  year: number;
  topic: string;
  unit: number;
}

interface Subject {
  _id: string;
  name: string;
  semester: number;
  code?: string;
  credits?: number;
}

type ViewMode = "units" | "yearwise";

export default function UnitsPage() {
  const params = useParams();
  const { branchId, semId, subjectId } = params;
  const [units, setUnits] = useState<Unit[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("units");
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>(
    {}
  );

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

  // Group questions by year and unit
  const questionsByYear = questions.reduce((acc, question) => {
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

  // Sort years in descending order
  const sortedYears = Object.keys(questionsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Toggle year expansion
  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || "";
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || "";

  return (
    <PageWrapper>
      <div className="relative z-10 h-screen flex flex-col">
        <Header
          branchId={parsedBranchId}
          semId={parsedSemId}
          backLink={`/branch/${parsedBranchId}/semester/${parsedSemId}`}
          backText="Back to Subjects"
          title={subject?.name || "Loading..."}
          subtitle={
            viewMode === "units"
              ? `${units.length} units to explore`
              : `${questions.length} questions across ${sortedYears.length} years`
          }
          stats={{
            primary: {
              value: viewMode === "units" ? units.length : sortedYears.length,
              label: viewMode === "units" ? "Units" : "Years",
            },
            secondary: {
              value:
                viewMode === "units"
                  ? units.reduce((acc, unit) => acc + unit.topics.length, 0)
                  : questions.length,
              label: viewMode === "units" ? "Topics" : "Questions",
            },
          }}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
            <div className="p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading content..." />
              ) : (
                <>
                  <div className="mb-8">
                    <div className="max-w-xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-700/50">
                      <div className="flex">
                        <button
                          onClick={() => setViewMode("units")}
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
                            viewMode === "units"
                              ? "bg-purple-500/20 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Unit-wise</span>
                        </button>
                        <button
                          onClick={() => setViewMode("yearwise")}
                          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all ${
                            viewMode === "yearwise"
                              ? "bg-purple-500/20 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Year-wise</span>
                        </button>
                      </div>
                    </div>
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
                        {units.map((unit, index) => (
                          <UnitCard
                            key={unit._id}
                            unit={unit}
                            index={index}
                            branchId={parsedBranchId}
                            semId={parsedSemId}
                            subjectId={subjectId as string}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="yearwise"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto space-y-6"
                      >
                        {sortedYears.map((year) => (
                          <div
                            key={year}
                            className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleYear(year)}
                              className="w-full px-8 py-5 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex items-baseline gap-3">
                                  <h2 className="text-2xl font-semibold text-white">
                                    {year}
                                  </h2>
                                  <span className="text-sm text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">
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
                                  <div className="px-8 py-6 space-y-8">
                                    {Object.entries(
                                      questionsByYear[year].byUnit
                                    )
                                      .sort(([a], [b]) => Number(a) - Number(b))
                                      .map(([unit, questions]) => (
                                        <div key={unit}>
                                          <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                              <BookOpen className="w-4 h-4 text-purple-400" />
                                            </div>
                                            <h3 className="text-lg font-medium text-white">
                                              Unit {unit}
                                            </h3>
                                            <span className="text-sm text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                              {questions.length} questions
                                            </span>
                                          </div>
                                          <div className="space-y-4">
                                            {questions.map(
                                              (question, qIndex) => (
                                                <motion.div
                                                  key={question._id}
                                                  initial={{ opacity: 0 }}
                                                  animate={{ opacity: 1 }}
                                                  transition={{
                                                    delay: qIndex * 0.05,
                                                  }}
                                                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5"
                                                >
                                                  <div className="flex flex-col gap-3">
                                                    <div className="flex items-center justify-between">
                                                      <span className="text-sm font-medium text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full">
                                                        {question.topic}
                                                      </span>
                                                      <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                        {question.marks} marks
                                                      </span>
                                                    </div>
                                                    <p className="text-gray-200">
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
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
