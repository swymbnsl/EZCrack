"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import axios from "axios";

interface Subject {
  _id: string;
  name: string;
  semester: number;
  code?: string;
  credits?: number;
}

export default function SubjectsPage() {
  const params = useParams();
  const { branchId, semId } = params;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `/api/subjects?branch=${branchId}&sem=${semId}`
        );
        const data = response.data;
        const sortedSubjects = [...(data.subjects || [])].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setSubjects(sortedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (branchId && semId) {
      fetchSubjects();
    }
  }, [branchId, semId]);

  const parsedBranchId = Array.isArray(branchId) ? branchId[0] : branchId || "";
  const parsedSemId = Array.isArray(semId) ? semId[0] : semId || "";

  return (
    <PageWrapper>
      <div className="relative z-10 min-h-screen sm:h-screen flex flex-col">
        <Header
          branchId={parsedBranchId}
          semId={parsedSemId}
          backLink="/"
          backText="Back to Home"
          title={`${parsedBranchId.toUpperCase()} Subjects`}
          subtitle={`${subjects.length} subjects to explore`}
          stats={{
            primary: { value: subjects.length, label: "Subjects" },
            secondary: {
              value: parsedSemId,
              label: "Semester",
            },
          }}
          showContributor={false}
        />

        <div className="flex-1 overflow-visible sm:overflow-hidden mt-6 sm:mt-0 bg-gradient-to-b from-gray-950 to-black sm:bg-none rounded-t-xl sm:rounded-none">
          <div className="sm:h-full sm:overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
            <div className="p-4 sm:p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading subjects..." />
              ) : subjects.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
                >
                  {subjects.map((subject, index) => (
                    <SubjectCard
                      key={subject._id}
                      subject={subject}
                      index={index}
                      branchId={parsedBranchId}
                      semId={parsedSemId}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  icon={Book}
                  title="No Subjects Available"
                  description={`No subjects are available for ${parsedBranchId.toUpperCase()} branch in Semester ${parsedSemId} yet. Check back later for updates.`}
                  iconColor="text-blue-400"
                  action={{
                    label: "Go Back Home",
                    onClick: () => (window.location.href = "/"),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
