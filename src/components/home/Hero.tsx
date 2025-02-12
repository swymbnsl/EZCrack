import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-20"
    >
      <motion.h1
        className="text-8xl md:text-[150px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-6 tracking-tight"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        EZCrack
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        20% Effort, 80% Results
      </motion.p>
    </motion.div>
  );
};
