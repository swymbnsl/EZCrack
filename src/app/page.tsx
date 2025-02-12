"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/ui/Dropdown";
import { GradientButton } from "@/components/ui/GradientButton";
import { Hero } from "@/components/home/Hero";

const branches = ["AIDS", "AIML", "Civil", "CSE", "ECE", "EEE", "IT", "Mech"];
const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

export default function Home() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const handleGetStarted = () => {
    if (selectedBranch && selectedSemester) {
      const searchParams = new URLSearchParams({
        branch: selectedBranch,
        semester: selectedSemester,
      });
      router.push(`/subjects?${searchParams.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Gradient Orbs */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.3, 1],
          x: ["-50%", "-40%", "-50%"],
          y: ["-50%", "-60%", "-50%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.4, 1],
          x: ["50%", "40%", "50%"],
          y: ["0%", "10%", "0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-500/30 rounded-full filter blur-3xl translate-x-1/2"
      />

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
    </div>
  );
}
