import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  text: string;
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <motion.div className="text-center py-20">
      <div className="inline-block p-3 bg-gray-800/50 rounded-lg">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-gray-400 text-lg mt-4">{text}</p>
    </motion.div>
  );
}
