import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface NeoBrutalistButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const GradientButton = ({
  onClick,
  disabled = false,
  children,
  className = "",
}: NeoBrutalistButtonProps) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <motion.button
      onClick={onClick}
      className={`w-full p-3 sm:p-4 md:p-5 rounded-none font-bold text-base sm:text-lg border-4 transition-all
        ${
          !disabled
            ? isLight 
              ? "bg-[#FF7B54] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
              : "bg-[#FF6B6B] text-[#121212] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] md:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]"
            : isLight
              ? "bg-gray-300 text-gray-600 border-gray-600 shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] sm:shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] cursor-not-allowed"
              : "bg-gray-700 text-gray-400 border-gray-500 shadow-[2px_2px_0px_0px_rgba(150,150,150,0.6)] sm:shadow-[4px_4px_0px_0px_rgba(150,150,150,0.6)] cursor-not-allowed"
        } ${className}`}
      disabled={disabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={!disabled ? { 
        boxShadow: isLight 
          ? "8px 8px 0px rgba(0,0,0,1)" 
          : "8px 8px 0px rgba(255,255,255,0.8)"
      } : {}}
      whileTap={!disabled ? { 
        boxShadow: isLight 
          ? "2px 2px 0px rgba(0,0,0,1)" 
          : "2px 2px 0px rgba(255,255,255,0.8)",
        transform: "translateX(2px) translateY(2px)"
      } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
};
