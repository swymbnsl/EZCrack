"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { TopicCard } from "@/components/topics/TopicCard";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { UnitSidebar } from "@/components/units/UnitSidebar";
import { UnitFiltersMobile } from "@/components/units/UnitFiltersMobile";
import { NotesModal } from "@/components/notes/NotesModal";
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal";
import { EmptyState } from "@/components/ui/EmptyState";
import axios from "axios";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  Calculator,
  FileQuestion,
  AlertCircle,
} from "lucide-react";

interface Topic {
  title: string;
  weightage: number;
  questions: Question[];
  years: number[];
}

interface Question {
  id: string;
  text: string;
  marks: number;
  year: number;
  midsem: boolean;
}

interface Note {
  topic: string;
  content: string;
  createdAt: string;
}

interface Unit {
  _id: string;
  number: number;
  topics: Topic[];
  subject_id: string;
  notes?: Note[];
  formulaSheet?: {
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  repeatedQuestions?: {
    conceptBased: {
      concept: string;
      frequency: number;
      questions: {
        _id: string;
        question: string;
        marks: number;
        year: string;
        midsem: boolean;
      }[];
    }[];
    patternBased: {
      pattern: string;
      frequency: number;
      questions: {
        _id: string;
        question: string;
        marks: number;
        year: string;
        midsem: boolean;
      }[];
    }[];
  };
}

type SortOrder = "asc" | "desc" | "original";
type YearFilter = "all" | number;
type TabType = "topics" | "questions" | "repeated";

export default function UnitPage() {
  const params = useParams();
  const { branchId, semId, subjectId, unitId } = params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [sortOrder, setSortOrder] = useState<SortOrder>("original");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTopicNotes, setSelectedTopicNotes] = useState<Note | null>(
    null
  );
  const [showFormulaSheetModal, setShowFormulaSheetModal] = useState(false);
  const [activeRepeatedType, setActiveRepeatedType] = useState<
    "concept" | "pattern"
  >("concept");

  const generateAnalysisData = (rawUnit: any, questionsData: any): Unit => {
    const questions = questionsData.foundQuestions || [];

    interface TopicWithRawScore {
      title: string;
      rawScore: number;
      years: number[];
      questions: Question[];
    }

    // First pass: calculate raw scores for each topic
    const topicsWithRawScores: TopicWithRawScore[] = rawUnit.topics.map(
      (topic: string) => {
        const topicQuestions = questions.filter((q: any) => q.topic === topic);
        const years = [...new Set(topicQuestions.map((q: any) => q.year))];
        const totalMarks = topicQuestions.reduce(
          (sum: number, q: any) => sum + (q.marks || 0),
          0
        );
        const frequency = topicQuestions.length;

        // Raw score combines marks and frequency
        const rawScore = totalMarks * frequency;

        return {
          title: topic,
          rawScore,
          years,
          questions: topicQuestions.map((q: any) => ({
            id: q._id,
            text: q.question,
            marks: q.marks,
            year: q.year,
            midsem: q.midsem,
          })),
        };
      }
    );

    // Calculate total raw score only from topics that have questions
    const totalRawScore = topicsWithRawScores.reduce(
      (sum: number, topic: TopicWithRawScore) => sum + topic.rawScore,
      0
    );

    // Second pass: normalize to percentages
    return {
      ...rawUnit,
      topics: topicsWithRawScores.map((topic: TopicWithRawScore) => ({
        ...topic,
        weightage:
          topic.rawScore === 0
            ? 0
            : Math.round((topic.rawScore / totalRawScore) * 100),
      })),
    };
  };

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await axios.get(`/api/units/${unitId}`);
        const data = response.data;
        const questionsResponse = await axios.get(`/api/questions`, {
          params: {
            unit: data.unit.number,
            subjectId: subjectId,
          },
        });
        const questionsData = questionsResponse.data;

        setUnit(generateAnalysisData(data.unit, questionsData));
      } catch (error) {
        console.error("Error fetching unit:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (unitId) {
      fetchUnit();
    }
  }, [unitId]);

  const handleTopicClick = (topicTitle: string) => {
    if (unit?.notes) {
      const note = unit.notes.find((note) => note.topic === topicTitle);
      if (note) {
        setSelectedTopicNotes(note);
        setShowNotesModal(true);
      } else {
        // If no notes exist for this topic, fall back to showing questions
        setActiveTab("questions");
      }
    } else {
      // If no notes at all, fall back to showing questions
      setActiveTab("questions");
    }
  };

  const handleTopicNotesClick = (topicTitle: string) => {
    if (unit?.notes) {
      const note = unit.notes.find((note) => note.topic === topicTitle);
      if (note) {
        setSelectedTopicNotes(note);
        setShowNotesModal(true);
      }
    }
  };

  const hasTopicNotes = (topicTitle: string) => {
    return unit?.notes?.some((note) => note.topic === topicTitle) || false;
  };

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || "";
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || "";

  const sortedTopics = useMemo(() => {
    if (!unit) return [];

    let filtered = [...unit.topics];

    // Apply year filter if not "all" and we're on topics tab
    if (yearFilter !== "all") {
      filtered = filtered.filter((topic) =>
        topic.years.includes(yearFilter as number)
      );
    }

    if (sortOrder === "original") {
      return filtered;
    }

    return filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.weightage - b.weightage;
      } else {
        return b.weightage - a.weightage;
      }
    });
  }, [unit, sortOrder, yearFilter]);

  // Get unique years from all topics
  const uniqueYears = useMemo(() => {
    if (!unit) return [];

    const years = new Set<number>();
    unit.topics.forEach((topic) => {
      topic.years.forEach((year) => years.add(year));
    });

    return Array.from(years).sort((a, b) => b - a); // Sort years in descending order
  }, [unit]);

  // Update available years when unit changes
  useEffect(() => {
    if (unit) {
      setAvailableYears(uniqueYears);
    }
  }, [uniqueYears]);

  // Update when sortOrder changes (debugging)
  useEffect(() => {
    console.log("Sort order changed:", sortOrder);
  }, [sortOrder]);

  // Sort by topics or questions depending on active tab
  const handleSortOrderChange = (order: SortOrder) => {
    console.log("Parent component changing sort order to:", order);
    setSortOrder(order);
  };

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen sm:h-screen flex flex-col">
        <Header
          branchId={parsedBranchId}
          semId={parsedSemId}
          backLink={`/branch/${parsedBranchId}/semester/${parsedSemId}/subject/${subjectId}`}
          backText="Back to Units"
          title={`Unit ${unit?.number || ""}`}
          subtitle={`${unit?.topics.length || 0} topics to explore`}
          showWeightageInfo={true}
          stats={{
            primary: {
              value: unit?.topics.length || 0,
              label: "Topics",
            },
            secondary: {
              value: availableYears?.length || 0,
              label: "Years",
            },
          }}
        />

        <div className="flex-1 flex flex-col sm:flex-row overflow-visible sm:overflow-hidden mt-2 sm:mt-0 bg-gradient-to-b from-gray-950 to-black sm:bg-none">
          <div className="hidden sm:block sm:w-auto sm:min-w-[320px]">
            <UnitSidebar
              activeTab={activeTab === "repeated" ? "topics" : activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              sortOrder={sortOrder}
              onSortOrderChange={handleSortOrderChange}
              yearFilter={yearFilter}
              onYearFilterChange={setYearFilter}
              availableYears={availableYears || []}
              hasFormulaSheet={!!unit?.formulaSheet?.content}
              onFormulaSheetClick={() => setShowFormulaSheetModal(true)}
            />
          </div>

          {/* Mobile filters */}
          <UnitFiltersMobile
            activeTab={activeTab === "repeated" ? "topics" : activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            availableYears={availableYears || []}
            hasFormulaSheet={!!unit?.formulaSheet?.content}
            onFormulaSheetClick={() => setShowFormulaSheetModal(true)}
          />

          <div className="flex-1 overflow-visible sm:overflow-hidden">
            <div className="sm:h-full sm:overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
              <div className="p-3 sm:p-8">
                {isLoading ? (
                  <LoadingSpinner text="Loading content..." />
                ) : unit ? (
                  <AnimatePresence mode="wait">
                    {activeTab === "topics" ? (
                      unit.topics && unit.topics.length > 0 ? (
                        <motion.div
                          key="topics"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 auto-rows-fr"
                        >
                          {sortedTopics?.map((topic, index) => (
                            <TopicCard
                              key={`${topic.title}-${index}`}
                              topic={topic}
                              index={index}
                              onTopicClick={() => handleTopicClick(topic.title)}
                              hasNotes={hasTopicNotes(topic.title)}
                            />
                          ))}
                        </motion.div>
                      ) : (
                        <EmptyState
                          icon={BookOpen}
                          title="No Topics Available"
                          description="This unit doesn't have any topics yet. Check back later for updates."
                        />
                      )
                    ) : activeTab === "questions" ? (
                      <motion.div
                        key="questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                      >
                        {sortedTopics && sortedTopics.length > 0 ? (
                          sortedTopics.map((topic, topicIndex) => {
                            const filteredQuestions = topic.questions.filter(
                              (q) =>
                                yearFilter === "all" || q.year === yearFilter
                            );

                            return (
                              <motion.div
                                key={`${topic.title}-${topicIndex}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: topicIndex * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                              >
                                <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-10 h-10 shrink-0 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                      <BookOpen className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white break-words">
                                      {topic.title}
                                    </h2>
                                  </div>
                                  <span className="text-sm shrink-0 ml-3 text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full">
                                    <span className="hidden sm:inline">
                                      {filteredQuestions.length} questions
                                    </span>
                                    <span className="sm:hidden">
                                      {filteredQuestions.length} Qs
                                    </span>
                                  </span>
                                </div>
                                <div className="p-6 space-y-4">
                                  {filteredQuestions.length > 0 ? (
                                    filteredQuestions.map(
                                      (question, qIndex) => (
                                        <motion.div
                                          key={`${question.id}-${qIndex}`}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            delay:
                                              topicIndex * 0.1 + qIndex * 0.05,
                                          }}
                                          className="group relative bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 rounded-xl p-3 sm:p-5 transition-all"
                                        >
                                          <div className="flex flex-col gap-2 sm:gap-3">
                                            <div className="flex items-center text-xs">
                                              <div className="hidden sm:flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-medium text-white bg-purple-500/20 px-3 py-1.5 rounded-full">
                                                  {question.year}
                                                </span>
                                                <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                                                  {question.marks} marks
                                                </span>
                                                <span className="text-sm font-medium text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
                                                  {question.midsem
                                                    ? "Midterm"
                                                    : "Endterm"}
                                                </span>
                                              </div>
                                              <div className="sm:hidden flex items-center text-xs divide-x divide-gray-700">
                                                <span className="font-medium text-white pr-2">
                                                  {question.year}
                                                </span>
                                                <span className="font-medium text-emerald-400 px-2">
                                                  {question.marks}m
                                                </span>
                                                <span className="font-medium text-amber-400 pl-2">
                                                  {question.midsem
                                                    ? "Mid"
                                                    : "End"}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-200">
                                              {question.text}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )
                                    )
                                  ) : (
                                    <div className="py-8">
                                      <EmptyState
                                        icon={FileQuestion}
                                        title="No Questions Available"
                                        description={
                                          yearFilter !== "all"
                                            ? `No questions found for ${yearFilter}. Try selecting a different year.`
                                            : "No questions available for this topic yet."
                                        }
                                        iconColor="text-amber-400"
                                      />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          <div className="col-span-2">
                            <EmptyState
                              icon={FileQuestion}
                              title="No Questions Available"
                              description="There are no questions available for this unit yet."
                              iconColor="text-amber-400"
                            />
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="space-y-6 sm:space-y-8">
                        <div className="flex justify-center">
                          <div className="hidden sm:block bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1 mb-6">
                            <div className="flex items-center">
                              <button
                                onClick={() => setActiveRepeatedType("concept")}
                                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                                  activeRepeatedType === "concept"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-gray-100"
                                }`}
                              >
                                Concept Based
                              </button>
                              <button
                                onClick={() => setActiveRepeatedType("pattern")}
                                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                                  activeRepeatedType === "pattern"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-gray-100"
                                }`}
                              >
                                Pattern Based
                              </button>
                            </div>
                          </div>
                          <div className="sm:hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1 mb-4">
                            <div className="flex items-center">
                              <button
                                onClick={() => setActiveRepeatedType("concept")}
                                className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                                  activeRepeatedType === "concept"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-gray-100"
                                }`}
                              >
                                Concept Based
                              </button>
                              <button
                                onClick={() => setActiveRepeatedType("pattern")}
                                className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                                  activeRepeatedType === "pattern"
                                    ? "bg-purple-500 text-white"
                                    : "text-gray-300 hover:text-gray-100"
                                }`}
                              >
                                Pattern Based
                              </button>
                            </div>
                          </div>
                        </div>

                        {activeRepeatedType === "concept" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {unit?.repeatedQuestions?.conceptBased &&
                              unit.repeatedQuestions.conceptBased.map(
                                (concept, idx) => (
                                  <div
                                    key={`${concept.concept}-${idx}`}
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                                  >
                                    <div className="bg-purple-500/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/50">
                                      <h2 className="text-base sm:text-lg font-medium text-white">
                                        {concept.concept}
                                      </h2>
                                    </div>
                                    <div className="px-4 sm:px-6 py-3 sm:py-4">
                                      <div className="space-y-3 sm:space-y-4">
                                        {concept.questions.map((q, qIdx) => (
                                          <div
                                            key={`${q._id || qIdx}`}
                                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 sm:p-4"
                                          >
                                            <div className="flex flex-col gap-2 sm:gap-3">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.marks} marks
                                                </span>
                                                <span className="text-xs sm:text-sm font-medium text-amber-400 bg-amber-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.midsem
                                                    ? "Midterm"
                                                    : "Endterm"}
                                                </span>
                                                <span className="text-xs sm:text-sm font-medium text-blue-400 bg-blue-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.year}
                                                </span>
                                              </div>
                                              <p className="text-sm sm:text-base text-gray-200">
                                                {q.question}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        )}

                        {activeRepeatedType === "pattern" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {unit?.repeatedQuestions?.patternBased &&
                              unit.repeatedQuestions.patternBased.map(
                                (pattern, idx) => (
                                  <div
                                    key={`${pattern.pattern}-${idx}`}
                                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
                                  >
                                    <div className="bg-purple-500/10 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/50">
                                      <h2 className="text-base sm:text-lg font-medium text-white">
                                        {pattern.pattern}
                                      </h2>
                                    </div>
                                    <div className="px-4 sm:px-6 py-3 sm:py-4">
                                      <div className="space-y-3 sm:space-y-4">
                                        {pattern.questions.map((q, qIdx) => (
                                          <div
                                            key={`${q._id || qIdx}`}
                                            className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 sm:p-4"
                                          >
                                            <div className="flex flex-col gap-2 sm:gap-3">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-xs sm:text-sm font-medium text-emerald-400 bg-emerald-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.marks} marks
                                                </span>
                                                <span className="text-xs sm:text-sm font-medium text-amber-400 bg-amber-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.midsem
                                                    ? "Midterm"
                                                    : "Endterm"}
                                                </span>
                                                <span className="text-xs sm:text-sm font-medium text-blue-400 bg-blue-500/10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                                  {q.year}
                                                </span>
                                              </div>
                                              <p className="text-sm sm:text-base text-gray-200">
                                                {q.question}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatePresence>
                ) : (
                  <EmptyState
                    icon={AlertCircle}
                    title="Unit Not Available"
                    description="This unit's content is not available or could not be loaded."
                    iconColor="text-red-400"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <NotesModal
          isOpen={showNotesModal}
          onClose={() => setShowNotesModal(false)}
          note={selectedTopicNotes}
        />

        <FormulaSheetModal
          isOpen={showFormulaSheetModal}
          onClose={() => setShowFormulaSheetModal(false)}
          formulaSheet={unit?.formulaSheet || null}
          unitNumber={unit?.number || 0}
        />
      </div>
    </PageWrapper>
  );
}
