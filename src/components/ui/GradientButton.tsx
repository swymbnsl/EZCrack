import { motion } from "framer-motion";

interface GradientButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const GradientButton = ({
  onClick,
  disabled = false,
  children,
}: GradientButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-5 rounded-2xl text-white font-medium shadow-lg text-lg
        ${
          !disabled
            ? "bg-gradient-to-r from-indigo-500/90 via-purple-500/90 to-pink-500/90 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 backdrop-blur-sm"
            : "bg-gray-700/50 backdrop-blur-sm cursor-not-allowed"
        }`}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
