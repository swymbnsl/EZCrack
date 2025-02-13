"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  index: number;
  variants: any; // we could type this more strictly if needed
}

export const SubjectCard = ({ subject, index, variants }: SubjectCardProps) => {
  return (
    <motion.div
      variants={variants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative h-[200px] flex"
    >
      {/* Hover Glow Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl" />

      {/* Card Content */}
      <motion.div
        className="relative w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-2xl 
          hover:border-purple-500/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer
          shadow-[0_0_0_1px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_0_1px_rgba(168,85,247,0.2)]
          flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
            <BookOpen className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-2">
          {subject}
        </h3>
        <div className="mt-auto flex items-center gap-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          <span className="text-sm">Click to explore</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
