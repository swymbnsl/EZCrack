"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { TopicCard } from "@/components/topics/TopicCard";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { UnitSidebar } from "@/components/units/UnitSidebar";
import axios from "axios";

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
}

interface Unit {
  _id: string;
  number: number;
  topics: Topic[];
  subject_id: string;
}

type SortOrder = "asc" | "desc";
type YearFilter = "all" | number;

export default function UnitPage() {
  const params = useParams();
  const { branchId, semId, subjectId, unitId } = params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [activeTab, setActiveTab] = useState<"topics" | "questions">("topics");

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

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || "";
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || "";

  const sortedTopics = unit?.topics.slice().sort((a, b) => {
    const comparison = a.weightage - b.weightage;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const availableYears = unit?.topics
    .flatMap((t) => t.years)
    .filter((year, index, self) => self.indexOf(year) === index)
    .sort((a, b) => b - a);

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
            setActiveTab={setActiveTab}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            availableYears={availableYears || []}
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
                            onTopicClick={() => setActiveTab("questions")}
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
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl max-w-[83%] font-semibold text-white">
                                {topic.title}
                              </h2>
                              <span className="text-sm text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                                {topic.questions.length} questions
                              </span>
                            </div>
                            <div className="space-y-4">
                              {topic.questions
                                .filter(
                                  (q) =>
                                    yearFilter === "all" ||
                                    q.year === yearFilter
                                )
                                .map((question, qIndex) => (
                                  <QuestionCard
                                    key={`${question.id}-${qIndex}`}
                                    question={question}
                                    index={qIndex}
                                    delay={topicIndex * 0.1 + qIndex * 0.05}
                                  />
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
      </div>
    </PageWrapper>
  );
}
