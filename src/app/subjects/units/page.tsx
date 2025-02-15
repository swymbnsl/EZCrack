"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChevronLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentCard } from "@/components/ui/ContentCard";

interface Unit {
  _id: string;
  created_at: string;
  number: number;
  subject_id: string;
  topics: string[];
  updated_at: string;
}

export default function UnitsPage() {
  const searchParams = useSearchParams();
  const subject_id = searchParams.get("subject_id");
  const branch = searchParams.get("branch");
  const sem = searchParams.get("sem");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`/api/units?subject_id=${subject_id}`);
        const data = await response.json();
        console.log("Fetched units:", data);
        setUnits(data.units || []);
      } catch (error) {
        console.error("Error fetching units:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subject_id) {
      fetchUnits();
    }
  }, [subject_id]);

  return (
    <PageWrapper>
      <motion.div
        key={`units-page-${subject_id}-${branch}-${sem}`}
        className="max-w-6xl mx-auto relative z-10 p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href={`/subjects?branch=${branch}&sem=${sem}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Subjects
          </Link>

          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Units
          </h1>
          <p className="text-gray-400 text-lg">
            Select a unit to explore study materials
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">Loading units...</p>
          </motion.div>
        ) : units.length > 0 ? (
          <motion.div
            key={`units-grid-${subject_id}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {units.map((unit) => (
              <ContentCard
                key={unit._id}
                title={
                  unit.topics.length > 0
                    ? unit.topics[0]
                    : `Unit ${unit.number}`
                }
                subtitle={`Unit ${unit.number}`}
                onClick={() => {
                  // Add navigation logic here when needed
                  console.log(`Clicked unit ${unit.number}`);
                }}
                variants={item}
                additionalInfo={`${unit.topics.length} topics`}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">No units found.</p>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
