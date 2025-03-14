import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Calculator } from "lucide-react";

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
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 hover:border-purple-500/30 transition-all"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-white">
            Unit {unit.number}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-semibold bg-purple-500/10 px-3 py-1 rounded-full">
              {unit.topics.length} topics
            </span>
          </div>
        </div>
        <div className="text-gray-400">
          {unit.topics.slice(0, 3).map((topic, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-purple-400/50 rounded-full" />
              <span className="text-sm">{topic}</span>
            </div>
          ))}
          {unit.topics.length > 3 && (
            <p className="text-sm text-gray-500 mt-2">
              +{unit.topics.length - 3} more topics
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          {hasNotes && (
            <div className="flex items-center gap-1.5 text-sm text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-lg">
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </div>
          )}
          {hasFormulaSheet && (
            <div className="flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg">
              <Calculator className="w-4 h-4" />
              <span>Formula Sheet</span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
