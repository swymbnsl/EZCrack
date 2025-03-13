import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  iconColor?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconColor = "text-purple-400",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div
        className={`w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-6 ${
          iconColor.includes("text-")
            ? iconColor.replace("text-", "text-")
            : `text-${iconColor}-400`
        }`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-8">{description}</p>

      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors border border-purple-500/30"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
