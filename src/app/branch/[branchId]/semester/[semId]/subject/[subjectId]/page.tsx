"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { UnitCard } from "@/components/units/UnitCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import axios from "axios";

interface Unit {
  _id: string;
  number: number;
  topics: string[];
}

interface Subject {
  _id: string;
  name: string;
  semester: number;
  code?: string;
  credits?: number;
}

export default function UnitsPage() {
  const params = useParams();
  const { branchId, semId, subjectId } = params;
  const [units, setUnits] = useState<Unit[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsResponse, subjectResponse] = await Promise.all([
          axios.get(`/api/units?subject_id=${subjectId}`),
          axios.get(`/api/subjects/${subjectId}`),
        ]);

        const [unitsData, subjectData] = await Promise.all([
          unitsResponse.data,
          subjectResponse.data,
        ]);

        setUnits(unitsData.units);
        setSubject(subjectData.subject);
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
          subtitle={`${units.length} units to explore`}
          stats={{
            primary: { value: units.length, label: "Units" },
            secondary: {
              value: units.reduce((acc, unit) => acc + unit.topics.length, 0),
              label: "Topics",
            },
          }}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
            <div className="p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading units..." />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
