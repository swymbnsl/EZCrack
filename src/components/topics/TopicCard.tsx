"use client";

import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface TopicCardProps {
  topic: {
    title: string;
    weightage: number;
    questions: {
      id: string;
      text: string;
      marks: number;
      year: number;
    }[];
    years: number[];
  };
  index: number;
  onTopicClick?: () => void;
  hasNotes?: boolean;
}

export function TopicCard({
  topic,
  index,
  onTopicClick,
  hasNotes = false,
}: TopicCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        rotate: -1,
        transition: { duration: 0.2 }
      }}
      onClick={onTopicClick}
      className={`w-full ${
        isLight 
          ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
          : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
      } border-4 p-6 transition-all cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onTopicClick?.();
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold mb-2 relative inline-block ${
              isLight ? "text-black" : "text-white"
            }`}>
              {topic.title}
            </h2>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-sm ${
                isLight 
                  ? "bg-[#FFD56B] text-black border-black" 
                  : "bg-[#FFE66D] text-[#121212] border-white"
              } border-2`}>
                {topic.weightage}% Weightage
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="relative h-2 overflow-hidden border-2 border-current">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${topic.weightage}%` }}
            transition={{
              duration: 1,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className={`absolute inset-y-0 left-0 ${
              isLight ? "bg-[#76ABAE]" : "bg-[#4ECDC4]"
            }`}
          />
        </div>
        <div className={`text-sm ${isLight ? "text-black" : "text-white"}`}>
          {topic.questions?.length} questions available
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="mt-6 flex flex-wrap gap-2 items-center justify-between"
      >
        <div className="flex flex-wrap gap-2">
          {topic.years?.map((year) => (
            <span
              key={year}
              className={`inline-flex items-center gap-1 px-2 py-1 text-sm border-2 ${
                isLight 
                  ? "bg-[#FF7B54] text-black border-black" 
                  : "bg-[#FF6B6B] text-[#121212] border-white"
              }`}
            >
              <Calendar className="w-3 h-3" />
              {year}
            </span>
          ))}
        </div>

        {hasNotes && (
          <div className={`flex items-center gap-1 px-3 py-1.5 text-sm border-2 ${
            isLight 
              ? "bg-[#76ABAE] text-black border-black" 
              : "bg-[#4ECDC4] text-[#121212] border-white"
          }`}>
            <FileText className="w-3.5 h-3.5" />
            <span>View Notes</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
