"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Calculator } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface UnitCardProps {
  unit: {
    _id: string;
    number: number;
    topics: string[];
    notes?: {
      topic: string;
      content: string;
      createdAt: string;
    }[];
    formulaSheet?: {
      content: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  index: number;
  branchId: string;
  semId: string;
  subjectId: string;
}

export function UnitCard({
  unit,
  index,
  branchId,
  semId,
  subjectId,
}: UnitCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const hasNotes = unit.notes && unit.notes.length > 0;
  const hasFormulaSheet = unit.formulaSheet && unit.formulaSheet.content;

  return (
    <Link
      href={`/branch/${branchId}/semester/${semId}/subject/${subjectId}/unit/${unit._id}`}
      className="block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        className={`${
          isLight 
            ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
            : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
        } border-4 p-6 transition-all`}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className={`text-xl font-bold ${
            isLight ? "text-black" : "text-white"
          }`}>
            Unit {unit.number}
          </h2>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-sm ${
              isLight 
                ? "bg-[#FFD56B] text-black border-black" 
                : "bg-[#FFE66D] text-[#121212] border-white"
            } border-2`}>
              {unit.topics.length} topics
            </span>
          </div>
        </div>

        <div className={`space-y-2 ${isLight ? "text-black" : "text-white"}`}>
          {unit.topics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 ${
                isLight ? "bg-[#76ABAE]" : "bg-[#4ECDC4]"
              }`} />
              <span className="text-sm">{topic}</span>
            </div>
          ))}
          {unit.topics.length > 3 && (
            <p className={`text-sm mt-2 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              +{unit.topics.length - 3} more topics
            </p>
          )}
        </div>

        {(hasNotes || hasFormulaSheet) && (
          <div className="mt-4 flex gap-2">
            {hasNotes && (
              <div className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isLight 
                  ? "bg-[#F5F5F5] text-black border-black" 
                  : "bg-[#252525] text-white border-white"
              } border`}>
                <FileText className="w-3 h-3" />
                <span>Notes</span>
              </div>
            )}
            {hasFormulaSheet && (
              <div className={`flex items-center gap-1 px-2 py-1 text-xs ${
                isLight 
                  ? "bg-[#F5F5F5] text-black border-black" 
                  : "bg-[#252525] text-white border-white"
              } border`}>
                <Calculator className="w-3 h-3" />
                <span>Formulas Sheet</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
