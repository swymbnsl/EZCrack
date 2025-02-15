"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Subject {
  _id: string;
  name: string;
  semester: number;
}

export default function SubjectsPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch")?.toLowerCase();
  const sem = searchParams.get("sem");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(
          `/api/subjects?branch=${branch}&sem=${sem}`
        );
        const data = await response.json();
        setSubjects(data.subjects || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (branch && sem) {
      fetchSubjects();
    }
  }, [branch, sem]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto relative z-10 p-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            {branch?.toUpperCase()} - Semester {sem}
          </h1>
          <p className="text-gray-400 text-lg">
            Select a subject to explore study materials
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">Loading subjects...</p>
          </motion.div>
        )}

        {/* Subjects Grid */}
        {!isLoading && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {subjects.map((subject, index) => (
              <SubjectCard
                key={subject._id}
                subject={subject.name}
                index={index}
                variants={item}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && subjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">
              No subjects found for this semester.
            </p>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
