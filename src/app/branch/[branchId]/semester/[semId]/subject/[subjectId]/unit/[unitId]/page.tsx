"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { TopicCard } from "@/components/topics/TopicCard";
import { UnitSidebar } from "@/components/units/UnitSidebar";
import { UnitFiltersMobile } from "@/components/units/UnitFiltersMobile";
import { NotesModal } from "@/components/notes/NotesModal";
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal";
import { EmptyState } from "@/components/ui/EmptyState";
import axios from "axios";
import { BookOpen, FileQuestion, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/contexts/ThemeContext";

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

interface RawQuestion {
  _id: string;
  topics: string[];
  question: string;
  marks: number;
  year: number;
  midsem: boolean;
}

interface QuestionsData {
  foundQuestions: RawQuestion[];
}

interface RawUnit {
  topics: string[];
  number: number;
  _id: string;
  subject_id: string;
  notes?: Note[];
  formulaSheet?: {
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  repeatedQuestions?: Unit["repeatedQuestions"];
}

type SortOrder = "asc" | "desc" | "original";
type YearFilter = "all" | number;
type TabType = "topics" | "questions";

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
  const { theme } = useTheme();
  const isLight = theme === "light";

  const generateAnalysisData = (
    rawUnit: RawUnit,
    questionsData: QuestionsData
  ): Unit => {
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
        // Find questions that include this topic in their topics array
        const topicQuestions = questions.filter(
          (q: RawQuestion) => q.topics && q.topics.includes(topic)
        );
        const years = [
          ...new Set(topicQuestions.map((q: RawQuestion) => q.year)),
        ];
        const totalMarks = topicQuestions.reduce(
          (sum: number, q: RawQuestion) => sum + (q.marks || 0),
          0
        );
        const frequency = topicQuestions.length;

        // Raw score combines marks and frequency
        const rawScore = frequency > 0 ? totalMarks * frequency : 0;

        return {
          title: topic,
          rawScore,
          years,
          questions: topicQuestions.map((q: RawQuestion) => ({
            id: q._id,
            text: q.question,
            marks: q.marks,
            year: q.year,
            midsem: q.midsem,
          })),
        };
      }
    );

    // Calculate total raw score from topics that have questions
    const topicsWithQuestions = topicsWithRawScores.filter(
      (topic) => topic.questions.length > 0
    );

    // If no topics have questions, avoid division by zero
    const totalRawScore = topicsWithQuestions.reduce(
      (sum: number, topic: TopicWithRawScore) => sum + topic.rawScore,
      0
    );

    // Calculate initial weightages
    const topicsWithWeightage = topicsWithRawScores.map(
      (topic: TopicWithRawScore) => {
        // Only topics with questions should have weightage
        const hasQuestions = topic.questions.length > 0;

        // If topic has questions but totalRawScore is 0, give it full weightage
        if (hasQuestions && totalRawScore === 0) {
          return {
            ...topic,
            // If there's only one topic with questions, give it 100%
            // Otherwise divide evenly among topics with questions
            weightage:
              topicsWithQuestions.length === 1
                ? 100
                : Math.floor(100 / topicsWithQuestions.length),
            exactWeightage: 100 / topicsWithQuestions.length,
          };
        }

        // Calculate exact weightage for topics with questions
        const exactWeightage = hasQuestions
          ? (topic.rawScore / totalRawScore) * 100
          : 0;

        // Ensure any topic with questions gets minimum 1% weightage
        // This prevents rounding down to zero for topics with very small weightage
        let weightage = 0;
        if (hasQuestions) {
          // If the exact weightage is very small but not zero, ensure minimum 1%
          weightage =
            exactWeightage < 1 && exactWeightage > 0
              ? 1
              : Math.round(exactWeightage);
        }

        return {
          ...topic,
          weightage,
          exactWeightage,
        };
      }
    );

    // Adjust weightages to ensure they sum to 100% (only if we have topics with questions)
    if (topicsWithQuestions.length > 0) {
      // Get the sum of all rounded weightages
      const weightageSum = topicsWithWeightage.reduce(
        (sum, topic) => sum + topic.weightage,
        0
      );

      // If the sum is not 100, adjust accordingly
      if (weightageSum !== 100) {
        // Sort by exact weightage descending (to adjust largest topics first)
        const sortedTopics = [...topicsWithWeightage]
          .filter((t) => t.questions.length > 0)
          .sort((a, b) => b.exactWeightage - a.exactWeightage);

        let remaining = 100 - weightageSum;

        // Distribute the difference among topics with questions
        // Either add or subtract to reach exactly 100%
        for (let i = 0; i < sortedTopics.length && remaining !== 0; i++) {
          const adjustment = remaining > 0 ? 1 : -1;
          const index = topicsWithWeightage.findIndex(
            (t) => t.title === sortedTopics[i].title
          );

          topicsWithWeightage[index].weightage += adjustment;
          remaining -= adjustment;
        }
      }
    }

    // Return the final unit with adjusted weightages
    return {
      ...rawUnit,
      topics: topicsWithWeightage.map(({ ...topic }) => topic),
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
  }, [unitId, subjectId]);

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
  }, [uniqueYears, unit]);

  // Sort by topics or questions depending on active tab
  const handleSortOrderChange = (order: SortOrder) => {
    setSortOrder(order);
  };

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen h-full sm:h-screen flex flex-col overflow-auto sm:overflow-hidden">
        <div className="sm:sticky sm:top-0 sm:z-20 bg-inherit">
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
        </div>

        <div className={`flex-1 flex flex-col sm:flex-row sm:overflow-hidden mt-2 sm:mt-0 ${isLight ? "bg-white sm:bg-[#F8F8F8]" : "bg-gradient-to-b from-gray-950 to-black sm:bg-[#121212]"}`}>
          <div className={`hidden sm:block sm:w-auto sm:min-w-[320px] h-full overflow-y-auto ${
            isLight 
              ? "bg-[#EFEFEF] scrollbar-thin scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/60" 
              : "scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50"
          } scrollbar-thumb-rounded-full`}>
            <UnitSidebar
              activeTab={activeTab}
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
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            availableYears={availableYears || []}
            hasFormulaSheet={!!unit?.formulaSheet?.content}
            onFormulaSheetClick={() => setShowFormulaSheetModal(true)}
          />

          <div className={`flex-1 sm:h-full sm:overflow-y-auto ${
            isLight 
              ? "scrollbar-thin scrollbar-track-gray-200/40 scrollbar-thumb-gray-400/40 hover:scrollbar-thumb-gray-500/60" 
              : "scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50"
          } scrollbar-thumb-rounded-full`}>
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
                  ) : (
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
                              className={`${
                                isLight 
                                  ? "bg-white border-black" 
                                  : "bg-[#1E1E1E] border-white"
                              } border-4 rounded-xl overflow-hidden`}
                            >
                              <div className={`px-6 py-4 border-b-4 ${isLight ? "border-black" : "border-white"} flex items-center justify-between`}>
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className={`w-10 h-10 ${
                                    isLight 
                                      ? "bg-[#76ABAE] border-black" 
                                      : "bg-[#4ECDC4] border-white"
                                  } border-3 flex items-center justify-center`}>
                                    <BookOpen className={`w-5 h-5 ${isLight ? "text-black" : "text-[#121212]"}`} />
                                  </div>
                                  <h2 className={`text-lg font-semibold ${isLight ? "text-black" : "text-white"} break-words`}>
                                    {topic.title}
                                  </h2>
                                </div>
                                <span className={`text-sm shrink-0 ml-3 ${
                                  isLight 
                                    ? "bg-[#FFD56B] text-black border-black" 
                                    : "bg-[#4ECDC4] text-[#121212] border-white"
                                } border-2 px-3 py-1.5 rounded-none`}>
                                  <span className="hidden sm:inline">
                                    {filteredQuestions.length} questions
                                  </span>
                                  <span className="sm:hidden">
                                    {filteredQuestions.length} Qs
                                  </span>
                                </span>
                              </div>
                              <div className={`p-6 space-y-4 ${
                                isLight 
                                  ? "bg-[#F5F5F0] bg-opacity-70" 
                                  : "bg-[#121212]"
                              } h-full`}>
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
                                        className={`group relative ${
                                          isLight 
                                            ? "bg-white border-3 border-black/70 hover:border-black shadow-[2px_2px_0px_rgba(0,0,0,0.1)]" 
                                            : "bg-[#1E1E1E] border-3 border-white/70 hover:border-white"
                                        } p-3 sm:p-5 transition-all`}
                                      >
                                        <div className="flex flex-col gap-2 sm:gap-3">
                                          <div className="flex items-center text-xs">
                                            <div className="hidden sm:flex flex-wrap items-center gap-2">
                                              <span className={`text-sm font-medium px-3 py-1.5 border-2 ${
                                                isLight 
                                                  ? "bg-[#76ABAE] text-black border-black" 
                                                  : "bg-[#4ECDC4] text-[#121212] border-white"
                                              }`}>
                                                {question.year}
                                              </span>
                                              <span className={`text-sm font-medium px-3 py-1.5 border-2 ${
                                                isLight 
                                                  ? "bg-[#FFD56B] text-black border-black" 
                                                  : "bg-[#FFE66D] text-[#121212] border-white"
                                              }`}>
                                                {question.marks} marks
                                              </span>
                                              <span className={`text-sm font-medium px-3 py-1.5 border-2 ${
                                                isLight 
                                                  ? "bg-[#FF7B54] text-black border-black" 
                                                  : "bg-[#FF6B6B] text-[#121212] border-white"
                                              }`}>
                                                {question.midsem
                                                  ? "Midterm"
                                                  : "Endterm"}
                                              </span>
                                            </div>
                                            <div className="sm:hidden flex items-center text-xs divide-x divide-gray-700">
                                              <span className={`font-medium pr-2 ${isLight ? "text-black" : "text-white"}`}>
                                                {question.year}
                                              </span>
                                              <span className={`font-medium px-2 ${isLight ? "text-[#76ABAE]" : "text-emerald-400"}`}>
                                                {question.marks}m
                                              </span>
                                              <span className={`font-medium pl-2 ${isLight ? "text-[#FF7B54]" : "text-amber-400"}`}>
                                                {question.midsem
                                                  ? "Mid"
                                                  : "End"}
                                              </span>
                                            </div>
                                          </div>
                                          <div className={`text-sm sm:text-base prose ${isLight ? "prose-black" : "prose-invert"} max-w-none ${isLight ? "light-katex" : ""} ${isLight ? "text-[#2D2A32]" : "text-gray-200"}`}>
                                            <ReactMarkdown
                                              remarkPlugins={[
                                                remarkGfm,
                                                remarkMath,
                                              ]}
                                              rehypePlugins={[
                                                [
                                                  rehypeKatex,
                                                  {
                                                    throwOnError: false,
                                                    strict: false,
                                                  },
                                                ],
                                              ]}
                                            >
                                              {question.text}
                                            </ReactMarkdown>
                                          </div>
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
