"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface SubjectCardProps {
  subject: {
    _id: string;
    name: string;
    code?: string;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 hover:border-purple-500/30 transition-all"
    >
      <Link
        href={`/branch/${branchId}/semester/${semId}/subject/${subject._id}`}
        className="block"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {subject.name}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="px-2.5 py-1 bg-gray-800/80 rounded-lg border border-gray-700/50">
                  {subject.code || "CS-301"}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800/80 rounded-lg border border-gray-700/50">
                  <GraduationCap className="w-4 h-4" />
                  <span>{subject.credits || 4} Credits</span>
                </div>
              </div>
            </div>
          </div>
          <span className="text-purple-400 font-medium bg-purple-500/10 px-3 py-1 rounded-full">
            Core
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
