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
import { School, BookOpen, AlertTriangle } from "lucide-react";
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

  const handleBranchSemSelect = (branch: string, sem: string) => {
    router.push(`/branch/${branch.toLowerCase()}/semester/${sem}`);
  };

  return (
    <PageWrapper>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto pt-32 px-4 relative z-10"
      >
        <Hero />

        {isLoading ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center items-center py-12"
          >
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </motion.div>
        ) : availableBranches.length > 0 && availableSemesters.length > 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8 max-w-xl mx-auto"
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

            <GradientButton
              onClick={handleGetStarted}
              disabled={!selectedBranch || !selectedSemester}
            >
              Get Started
            </GradientButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto mt-12"
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
