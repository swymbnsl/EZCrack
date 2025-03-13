"use client";

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden max-w-screen">
      <AnimatedBackground />
      {children}
    </div>
  );
};
