"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Calendar,
  BookOpen,
  Filter,
  SortAsc,
  SortDesc,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

interface Contributor {
  name: string;
  branch: string;
  semester: number;
  avatar: string;
  linkedinUrl: string;
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

  // Demo data generation
  const generateDemoData = (rawUnit: any): Unit => {
    const years = [2023, 2022, 2021, 2020];
    return {
      ...rawUnit,
      topics: rawUnit.topics.map((topic: string) => ({
        title: topic,
        weightage: Math.floor(Math.random() * 30) + 10, // Random weightage between 10-40
        years: years.filter(() => Math.random() > 0.5),
        questions: Array(Math.floor(Math.random() * 3) + 2)
          .fill(null)
          .map((_, i) => ({
            id: `q-${i}`,
            text: `Sample question ${i + 1} for ${topic}`,
            marks: [5, 10, 15][Math.floor(Math.random() * 3)],
            year: years[Math.floor(Math.random() * years.length)],
          })),
      })),
    };
  };

  // Inside the component, add this demo contributor data
  const contributor: Contributor = {
    name: "Swayam Bansal",
    branch: "ECE",
    semester: 2,
    avatar: "https://api.dicebear.com/9.x/adventurer/svg?seed=Valentina",
    linkedinUrl: "https://linkedin.com/in/swymbnsl",
  };

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${unitId}`);
        const data = await response.json();
        setUnit(generateDemoData(data.unit));
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
        <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-[2000px] mx-auto p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <Link
                  href={`/branch/${branchId}/semester/${semId}/subject/${subjectId}`}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Units
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 text-gray-400">
                    {Array.isArray(branchId)
                      ? branchId[0].toUpperCase()
                      : branchId?.toUpperCase()}
                  </span>
                  <span className="text-sm px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 text-gray-400">
                    Semester {semId}
                  </span>
                </div>
              </div>

              {isLoading ? (
                <motion.div className="space-y-4">
                  <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                </motion.div>
              ) : unit ? (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                      Unit {unit.number}
                    </h1>
                    <p className="text-gray-400 text-lg flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {unit.topics.length} topics to explore
                    </p>
                  </div>

                  <div className="flex-1 px-8">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                            <img
                              src={contributor.avatar}
                              alt={contributor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <BookOpen className="w-3 h-3 text-purple-400" />
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white">
                              {contributor.name}
                            </h3>
                            <span className="text-xs text-gray-400">
                              • Contributor
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/50 rounded-full">
                              {contributor.branch}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/50 rounded-full">
                              Sem {contributor.semester}
                            </span>
                          </div>
                        </div>

                        <motion.a
                          href={contributor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-purple-400 bg-purple-500/10 
                            hover:bg-purple-500/20 rounded-lg transition-colors flex items-center justify-center self-center"
                        >
                          <Linkedin className="w-5 h-5" />
                        </motion.a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-32 h-[88px] text-center px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {unit.topics.reduce(
                          (acc, topic) => acc + topic.questions.length,
                          0
                        )}
                      </div>
                      <div className="text-sm text-gray-400">Questions</div>
                    </div>
                    <div className="w-32 h-[88px] text-center px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {availableYears?.length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Years</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-lg">Unit not found</p>
              )}
            </motion.div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 min-w-[320px] border-r border-gray-800 flex flex-col bg-gray-900/50"
          >
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm uppercase text-gray-400 font-medium">
                    View
                  </h3>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
                <div className="bg-gray-800/30 p-1.5 rounded-xl flex flex-col gap-1.5">
                  <button
                    onClick={() => setActiveTab("topics")}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 relative text-left flex items-center gap-3 ${
                      activeTab === "topics"
                        ? "text-white bg-purple-500/20"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="p-2 bg-gray-700/30 rounded-lg">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    Topics & Weightage
                  </button>
                  <button
                    onClick={() => setActiveTab("questions")}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 relative text-left flex items-center gap-3 ${
                      activeTab === "questions"
                        ? "text-white bg-purple-500/20"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    <div className="p-2 bg-gray-700/30 rounded-lg">
                      <Filter className="w-4 h-4" />
                    </div>
                    Questions
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm uppercase text-gray-400 font-medium">
                    Sort By Weightage
                  </h3>
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-4 h-4 text-gray-500" />
                  ) : (
                    <SortDesc className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="bg-gray-800/30 p-1.5 rounded-xl flex gap-1.5">
                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all text-center ${
                      sortOrder === "asc"
                        ? "bg-purple-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    Ascending
                  </button>
                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`flex-1 px-4 py-2.5 rounded-lg transition-all text-center ${
                      sortOrder === "desc"
                        ? "bg-purple-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    Descending
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm uppercase text-gray-400 font-medium">
                    Filter by Year
                  </h3>
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div className="bg-gray-800/30 p-1.5 rounded-xl flex flex-col gap-1.5">
                  <button
                    onClick={() => setYearFilter("all")}
                    className={`px-4 py-2.5 rounded-lg transition-all text-left ${
                      yearFilter === "all"
                        ? "bg-purple-500/20 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                    }`}
                  >
                    All Years
                  </button>
                  {availableYears?.map((year) => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year)}
                      className={`px-4 py-2.5 rounded-lg transition-all text-left ${
                        yearFilter === year
                          ? "bg-purple-500/20 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/30"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
              <div className="p-8">
                {isLoading ? (
                  <motion.div className="text-center py-20">
                    <div className="inline-block p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-gray-400 text-lg mt-4">
                      Loading content...
                    </p>
                  </motion.div>
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
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all hover:bg-gray-800/70 hover:border-purple-500/30 flex flex-col"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <h2 className="text-xl font-semibold text-white">
                                {topic.title}
                              </h2>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="flex items-center gap-2"
                              >
                                <span className="text-purple-400 font-semibold bg-purple-500/10 px-3 py-1 rounded-full">
                                  {topic.weightage}%
                                </span>
                              </motion.div>
                            </div>

                            <div className="space-y-4 flex-grow">
                              <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${topic.weightage}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                  }}
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
                                />
                              </div>
                              <div className="text-sm text-gray-400">
                                {topic.questions.length} questions available
                              </div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="mt-6 flex flex-wrap gap-2"
                            >
                              {topic.years.map((year) => (
                                <span
                                  key={year}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/30 rounded-md text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
                                >
                                  <Calendar className="w-3 h-3" />
                                  {year}
                                </span>
                              ))}
                            </motion.div>
                          </motion.div>
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
                            key={topic.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: topicIndex * 0.1 }}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-semibold text-white">
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
                                  <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: topicIndex * 0.1 + qIndex * 0.05,
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    className="group p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-all border border-transparent hover:border-purple-500/20"
                                  >
                                    <div className="flex justify-between items-start gap-4">
                                      <p className="text-gray-200 group-hover:text-white transition-colors">
                                        {question.text}
                                      </p>
                                      <div className="flex flex-col items-end gap-2">
                                        <span className="text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full">
                                          {question.marks} marks
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          {question.year}
                                        </span>
                                      </div>
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
      </div>
    </PageWrapper>
  );
}
