"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { useTheme } from "@/contexts/ThemeContext";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-[#FFFFFA] text-[#2D2A32]" : "bg-[#121212] text-white"} relative overflow-x-hidden max-w-screen`}>
      <AnimatedBackground />
      {children}
    </div>
  );
};
