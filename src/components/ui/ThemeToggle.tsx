"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  minimal?: boolean;
}

export const ThemeToggle = ({ minimal = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  if (minimal) {
    return (
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-8 h-8 flex items-center justify-center transition-colors ${
          isLight 
            ? "text-black hover:text-[#FF7B54]" 
            : "text-white hover:text-[#4ECDC4]"
        }`}
        aria-label="Toggle theme"
      >
        {isLight ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2 rounded-none border-4 transition-all
        ${
          theme === "light"
            ? "bg-[#FFFFFA] "
            : "bg-[#1E1E1E] "
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-black" />
      ) : (
        <Sun className="w-5 h-5 text-white" />
      )}
    </motion.button>
  );
}; 