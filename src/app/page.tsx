"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { GradientButton } from "@/components/ui/GradientButton";
import { Hero } from "@/components/home/Hero";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { branches, semesters } from "@/constants/lists";

export default function Home() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const handleGetStarted = () => {
    if (selectedBranch && selectedSemester) {
      const semNumber = selectedSemester.replace("Semester ", "");
      const searchParams = new URLSearchParams({
        branch: selectedBranch.toLowerCase(),
        sem: semNumber,
      });
      router.push(`/subjects?${searchParams.toString()}`);
    }
  };

  return (
    <PageWrapper>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto pt-32 px-4 relative z-10"
      >
        <Hero />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8 max-w-xl mx-auto"
        >
          <Dropdown
            options={branches}
            value={selectedBranch}
            onChange={setSelectedBranch}
            placeholder="Select Branch"
          />

          <Dropdown
            options={semesters}
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
      </motion.main>
    </PageWrapper>
  );
}
