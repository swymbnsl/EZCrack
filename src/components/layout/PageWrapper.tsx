"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-x-hidden max-w-screen">
      <AnimatedBackground />
      {children}
    </div>
  );
};
