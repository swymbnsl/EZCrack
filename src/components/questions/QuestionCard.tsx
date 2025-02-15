import { motion } from "framer-motion";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    marks: number;
    year: number;
  };
  index: number;
  delay: number;
}

export function QuestionCard({ question, index, delay }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.01 }}
      className="group p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/40 transition-all border border-transparent hover:border-purple-500/20"
    >
      <div className="flex justify-between items-start gap-4">
        <p className="text-gray-200 group-hover:text-white transition-colors">
          {question.text}
        </p>
        <div className="flex flex-col items-end gap-2">
          <span className="text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full">
            {question.marks} marks
          </span>
          <span className="text-sm text-gray-400">{question.year}</span>
        </div>
      </div>
    </motion.div>
  );
}
