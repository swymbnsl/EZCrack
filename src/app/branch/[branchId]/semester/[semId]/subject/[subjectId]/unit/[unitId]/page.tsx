"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Unit {
  _id: string;
  number: number;
  topics: string[];
  subject_id: string;
}

interface Topic {
  title: string;
  content: string;
}

export default function UnitPage() {
  const params = useParams();
  const { branchId, semId, subjectId, unitId } = params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const response = await fetch(`/api/units/${unitId}`);
        const data = await response.json();
        setUnit(data.unit);
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

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            href={`/branch/${branchId}/semester/${semId}/subject/${subjectId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Units
          </Link>

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
            </motion.div>
          ) : unit ? (
            <>
              <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                Unit {unit.number}
              </h1>
              <p className="text-gray-400 text-lg">
                {unit.topics.length} topics to explore
              </p>
            </>
          ) : (
            <p className="text-gray-400 text-lg">Unit not found</p>
          )}
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">Loading unit content...</p>
          </motion.div>
        ) : unit ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {unit.topics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {topic}
                </h2>
                {/* Add topic content here when available */}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">
              This unit&apos;s content is not available.
            </p>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
