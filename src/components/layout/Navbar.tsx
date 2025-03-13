import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Home, Code, Users } from "lucide-react";

export const Navbar = () => {
  return (
    <>
      {/* Navigation bar - mobile centered, desktop right-aligned */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-40 px-4 flex justify-center sm:justify-end sm:top-6 sm:right-8 sm:left-auto sm:px-0"
      >
        <div className="flex items-center bg-gray-800/80 backdrop-blur-lg rounded-full border border-gray-700/50 shadow-lg p-1 mx-4 sm:mx-0 max-w-[calc(100%-2rem)] sm:max-w-none">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="https://swymbnsl.com"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Developer</span>
            <span className="sm:hidden">Dev</span>
          </Link>
          <Link
            href="/contributors"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Contributors</span>
          </Link>
        </div>

        {/* Desktop Join Community button - separate from navbar */}
        <motion.a
          href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 ml-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-4 py-2.5 rounded-full shadow-lg transition-all"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium">Join Community</span>
        </motion.a>
      </motion.nav>

      {/* Mobile floating WhatsApp button */}
      <motion.a
        href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </>
  );
};
