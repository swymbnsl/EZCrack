"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
        const response = await fetch(
          `/api/subjects?branch=${branchId}&sem=${semId}`
        );
        const data = await response.json();
        setSubjects(data.subjects || []);
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

  return (
    <PageWrapper>
      <div className="relative z-10 h-screen flex flex-col">
        <Header
          branchId={Array.isArray(branchId) ? branchId[0] : branchId || ""}
          semId={Array.isArray(semId) ? semId[0] : semId || ""}
          backLink="/"
          backText="Back to Home"
          title={`${
            Array.isArray(branchId)
              ? branchId[0].toUpperCase()
              : branchId?.toUpperCase()
          } Subjects`}
          subtitle={`${subjects.length} subjects to explore`}
          stats={{
            primary: { value: subjects.length, label: "Subjects" },
            secondary: {
              value: Array.isArray(semId) ? semId[0] : semId || "",
              label: "Semester",
            },
          }}
          showContributor={false}
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800/40 scrollbar-thumb-gray-600/40 hover:scrollbar-thumb-gray-500/50 scrollbar-thumb-rounded-full">
            <div className="p-8">
              {isLoading ? (
                <LoadingSpinner text="Loading subjects..." />
              ) : (
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
                      branchId={
                        Array.isArray(branchId) ? branchId[0] : branchId || ""
                      }
                      semId={Array.isArray(semId) ? semId[0] : semId || ""}
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
