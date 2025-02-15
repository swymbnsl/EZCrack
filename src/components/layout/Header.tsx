import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  branchId: string | string[];
  semId: string;
  backLink: string;
  backText: string;
  title: string;
  subtitle: string;
  stats: {
    primary: { value: number | string; label: string };
    secondary: { value: number | string; label: string };
  };
}

export function Header({
  branchId,
  semId,
  backLink,
  backText,
  title,
  subtitle,
  stats,
}: HeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-[2000px] mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <Link
              href={backLink}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {backText}
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 text-gray-400">
                {Array.isArray(branchId)
                  ? branchId[0].toUpperCase()
                  : branchId?.toUpperCase()}
              </span>
              <span className="text-sm px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50 text-gray-400">
                Semester {semId}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                {title}
              </h1>
              <p className="text-gray-400 text-lg flex items-center gap-2">
                {subtitle}
              </p>
            </div>

            <div className="flex gap-4">
              <StatCard
                value={stats.primary.value}
                label={stats.primary.label}
              />
              <StatCard
                value={stats.secondary.value}
                label={stats.secondary.label}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="w-32 h-[88px] text-center px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col items-center justify-center">
      <div className="text-2xl font-bold text-purple-400">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
