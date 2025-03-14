import { motion } from "framer-motion";
import { Calendar, FileText } from "lucide-react";

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
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={onTopicClick}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all hover:bg-gray-800/70 hover:border-purple-500/30 flex flex-col cursor-pointer relative"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onTopicClick?.();
        }
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold text-white">{topic.title}</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
          className="flex items-center gap-2"
        >
          <span className="text-purple-400 font-semibold bg-purple-500/10 px-3 py-1 rounded-full">
            {topic.weightage}%
          </span>
        </motion.div>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="relative h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${topic.weightage}%` }}
            transition={{
              duration: 1,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
        <div className="text-sm text-gray-400">
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
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-700/30 rounded-md text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              <Calendar className="w-3 h-3" />
              {year}
            </span>
          ))}
        </div>

        {hasNotes && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 rounded-md text-sm text-purple-400 border border-purple-500/30 transition-colors">
            <FileText className="w-3.5 h-3.5" />
            <span>View Notes</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
