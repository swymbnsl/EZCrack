"use client";

import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <motion.div
        animate={{
          x: ["0%", "-25%", "0%"],
          y: ["0%", "-15%", "0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.05),transparent_20%)] blur-3xl"
      />
    </div>
  );
};
