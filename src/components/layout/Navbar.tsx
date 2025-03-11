import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 right-8 z-50"
    >
      <div className="flex items-center justify-end gap-3">
        <div className="flex items-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 p-1.5">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors relative group"
          >
            Home
            <motion.div
              className="absolute inset-0 bg-white/5 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="navHover"
            />
          </Link>
          <Link
            href="https://swymbnsl.com"
            target="_blank"
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors relative group"
          >
            Developer
            <motion.div
              className="absolute inset-0 bg-white/5 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="navHover"
            />
          </Link>
          <Link
            href="/contributors"
            className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors relative group"
          >
            Contributors
            <motion.div
              className="absolute inset-0 bg-white/5 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="navHover"
            />
          </Link>
        </div>

        <motion.a
          href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-500/90 hover:to-emerald-500/90 text-white pl-2 pr-4 py-2.5 rounded-full backdrop-blur-md shadow-lg shadow-green-500/20 transition-all hover:shadow-green-500/30 hover:scale-[1.02] border border-white/10"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-medium">Join Community</span>
        </motion.a>
      </div>
    </motion.nav>
  );
};
