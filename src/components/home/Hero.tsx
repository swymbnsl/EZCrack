import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export const Hero = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-6 sm:mb-10 md:mb-16"
    >
      <motion.h1
        className={`text-6xl sm:text-7xl md:text-9xl lg:text-[150px] font-bold mb-2 sm:mb-3 md:mb-6 tracking-tight relative`}
        initial={{ 
          y: -100, 
          opacity: 0,
          rotate: 5
        }}
        animate={{ 
          y: 0, 
          opacity: 1,
          rotate: 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 100,
          damping: 15
        }}
      >
        <div className="relative inline-block">
          {/* Background element */}
          <motion.span 
            className={`absolute -inset-2 sm:-inset-3 md:-inset-4 -z-10 ${
              isLight 
                ? "bg-[#76ABAE] border-4 border-black" 
                : "bg-[#4ECDC4] border-4 border-white"
            } transform -rotate-3`}
            initial={{ rotate: 10 }}
            animate={{ rotate: -3 }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              damping: 15, 
              delay: 0.2
            }}
          ></motion.span>
          
          {/* Text with shadow */}
          <span className={`relative inline-block ${
            isLight 
              ? "text-[#111111] drop-shadow-[4px_4px_0px_rgba(255,123,84,1)]" 
              : "text-white drop-shadow-[4px_4px_0px_rgba(255,107,107,1)]"
          }`}>
            EZCrack
          </span>
        </div>
      </motion.h1>
      <motion.p
        className={`text-base sm:text-lg md:text-xl lg:text-2xl ${
          isLight 
            ? "text-[#2D2A32] bg-[#FFD56B] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" 
            : "text-[#121212] bg-[#FFE66D] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)] sm:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
        } px-4 sm:px-6 py-1 sm:py-2 inline-block rotate-1 border-3 sm:border-4 font-bold`}
        initial={{ 
          scale: 0.8, 
          opacity: 0,
          x: -20,
          rotate: 5
        }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: 0,
          rotate: 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 20, 
          delay: 0.4 
        }}
        whileHover={{
          y: -5,
          rotate: -1,
          boxShadow: isLight
            ? "8px 8px 0px rgba(0,0,0,1)"
            : "8px 8px 0px rgba(255,255,255,0.8)",
          transition: {
            duration: 0.3
          }
        }}
      >
        20% Effort, 80% Results
      </motion.p>
    </motion.div>
  );
};
