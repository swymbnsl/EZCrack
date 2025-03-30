"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface SubjectCardProps {
  subject: {
    _id: string;
    name: string;
    subject_code?: string;
    credits?: number;
  };
  index: number;
  branchId: string | string[];
  semId: string;
}

export function SubjectCard({
  subject,
  index,
  branchId,
  semId,
}: SubjectCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <Link
      href={`/branch/${branchId}/semester/${semId}/subject/${subject._id}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.02,
          rotate: -1,
          transition: { duration: 0.2 }
        }}
        className={`${
          isLight 
            ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
            : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
        } border-4 transform rotate-1 p-6 transition-all`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h2 className={`text-xl font-bold mb-2 relative inline-block ${
                isLight ? "text-black" : "text-white"
              }`}>
                <motion.span 
                  className={`absolute -inset-2 -z-10 transform -rotate-2`}
                  initial={{ rotate: 5 }}
                  animate={{ rotate: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                ></motion.span>
                {subject.name}
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className={`px-2.5 py-1 ${
                  isLight 
                    ? "bg-[#FFD56B] text-black border-black" 
                    : "bg-[#FFE66D] text-[#121212] border-white"
                } border-2 transform rotate-1`}>
                  {subject.subject_code || "CS-301"}
                </span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 ${
                  isLight 
                    ? "bg-[#FF7B54] text-black border-black" 
                    : "bg-[#FF6B6B] text-[#121212] border-white"
                } border-2 transform -rotate-1`}>
                  <GraduationCap className="w-4 h-4" />
                  <span>{subject.credits || 3} Credits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
