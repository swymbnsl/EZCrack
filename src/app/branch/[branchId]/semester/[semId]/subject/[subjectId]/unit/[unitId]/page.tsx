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
import { NotesModal } from "@/components/notes/NotesModal";
import { FormulaSheetModal } from "@/components/notes/FormulaSheetModal";
import axios from "axios";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ListOrdered,
  Calculator,
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
}

type SortOrder = "asc" | "desc" | "original";
type YearFilter = "all" | number;

export default function UnitPage() {
  const params = useParams();
  const { branchId, semId, subjectId, unitId } = params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"topics" | "questions">("topics");
  const [sortOrder, setSortOrder] = useState<SortOrder>("original");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTopicNotes, setSelectedTopicNotes] = useState<Note | null>(
    null
  );
  const [showFormulaSheetModal, setShowFormulaSheetModal] = useState(false);

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

    // Calculate total raw score
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
          totalRawScore === 0
            ? Math.round(100 / topicsWithRawScores.length) // Equal distribution if no questions
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

    if (sortOrder === "original") {
      return [...unit.topics];
    }

    return [...unit.topics].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.weightage - b.weightage;
      } else {
        return b.weightage - a.weightage;
      }
    });
  }, [unit, sortOrder]);

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

  return (
    <PageWrapper>
      <div className="relative z-10 h-screen flex flex-col">
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

        <div className="flex-1 flex overflow-hidden">
          <UnitSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            yearFilter={yearFilter}
            onYearFilterChange={setYearFilter}
            availableYears={availableYears || []}
            hasFormulaSheet={!!unit?.formulaSheet?.content}
            onFormulaSheetClick={() => setShowFormulaSheetModal(true)}
          />

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
              <div className="p-8">
                {isLoading ? (
                  <LoadingSpinner text="Loading content..." />
                ) : unit ? (
                  <AnimatePresence mode="wait">
                    {activeTab === "topics" ? (
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
                      <motion.div
                        key="questions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                      >
                        {sortedTopics?.map((topic, topicIndex) => (
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
                                <h2 className="text-lg font-semibold text-white truncate">
                                  {topic.title}
                                </h2>
                              </div>
                              <span className="text-sm shrink-0 ml-3 text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full">
                                {topic.questions.length} questions
                              </span>
                            </div>
                            <div className="p-6 space-y-4">
                              {topic.questions
                                .filter(
                                  (q) =>
                                    yearFilter === "all" ||
                                    q.year === yearFilter
                                )
                                .map((question, qIndex) => (
                                  <motion.div
                                    key={`${question.id}-${qIndex}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: topicIndex * 0.1 + qIndex * 0.05,
                                    }}
                                    className="group relative bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30 hover:border-purple-500/30 rounded-xl p-5 transition-all"
                                  >
                                    <div className="flex flex-col gap-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
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
                                      </div>
                                      <p className="text-gray-200">
                                        {question.text}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <motion.div className="text-center py-20">
                    <p className="text-gray-400 text-lg">
                      This unit&apos;s content is not available.
                    </p>
                  </motion.div>
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
