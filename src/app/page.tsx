"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { GradientButton } from "@/components/ui/GradientButton";
import { Hero } from "@/components/home/Hero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { School, BookOpen } from "lucide-react";
import { branches, semesters } from "@/constants/lists";

export default function Home() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<string[]>([]);

  useEffect(() => {
    // In a real app, you might fetch this data from an API
    // For now, we'll use the static data from constants
    setAvailableBranches(branches);
    setAvailableSemesters(semesters);
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (selectedBranch && selectedSemester) {
      const semNumber = selectedSemester.replace("Semester ", "");
      router.push(
        `/branch/${selectedBranch.toLowerCase()}/semester/${semNumber}`
      );
    }
  };

  return (
    <PageWrapper>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-5xl mx-auto pt-16 sm:pt-24 md:pt-32 px-4 sm:px-6 md:px-8 relative z-10 min-h-[calc(100vh-80px)] flex flex-col justify-center"
      >
        <Hero />

        {isLoading ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center py-8 sm:py-12"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </motion.div>
        ) : availableBranches.length > 0 && availableSemesters.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-xl mx-auto px-2 sm:px-4"
          >
            <Dropdown
              options={availableBranches}
              value={selectedBranch}
              onChange={setSelectedBranch}
              placeholder="Select Branch"
            />

            <Dropdown
              options={availableSemesters}
              value={selectedSemester}
              onChange={setSelectedSemester}
              placeholder="Select Semester"
            />

            <div className="pt-2 sm:pt-4">
              <GradientButton
                onClick={handleGetStarted}
                disabled={!selectedBranch || !selectedSemester}
                className="w-full justify-center"
              >
                Get Started
              </GradientButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-xl mx-auto mt-6 sm:mt-8 md:mt-12 px-2 sm:px-4"
          >
            <EmptyState
              icon={availableBranches.length === 0 ? School : BookOpen}
              title={
                availableBranches.length === 0
                  ? "No Branches Available"
                  : "No Semesters Available"
              }
              description={
                availableBranches.length === 0
                  ? "There are no branches available yet. Please check back later."
                  : "There are no semesters available yet. Please check back later."
              }
              iconColor={
                availableBranches.length === 0
                  ? "text-blue-400"
                  : "text-purple-400"
              }
            />
          </motion.div>
        )}
      </motion.main>
    </PageWrapper>
  );
}
