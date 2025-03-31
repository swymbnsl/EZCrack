import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Home, Code, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const pathname = usePathname();
  
  return (
    <>
      {/* Navigation bar - mobile centered, desktop right-aligned */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-40 flex justify-center sm:justify-end sm:top-6 sm:right-8 sm:left-auto sm:px-0"
      >
        <div className={`flex items-center justify-between ${isLight ? "bg-white border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : "bg-[#1E1E1E] border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"} border-4 rounded-none p-1 w-[calc(100%-2rem)] sm:w-auto sm:mx-0`}>
          <Link
            href="/"
            className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              pathname === "/" 
                ? isLight 
                  ? "bg-[#FFD56B] text-black"
                  : "bg-[#4ECDC4] text-[#121212]"
                : isLight 
                  ? "text-black hover:bg-[#FFD56B]" 
                  : "text-white hover:bg-[#4ECDC4] hover:text-[#121212]"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <a
            href="https://swymbnsl.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              isLight 
                ? "text-black" 
                : "text-white"
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">Developer</span>
            <span className="sm:hidden">Dev</span>
          </a>
          <Link
            href="/contributors"
            className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              pathname === "/contributors"
                ? isLight 
                  ? "bg-[#FFD56B] text-black"
                  : "bg-[#4ECDC4] text-[#121212]"
                : isLight 
                  ? "text-black hover:bg-[#FFD56B]" 
                  : "text-white hover:bg-[#4ECDC4] hover:text-[#121212]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-[11px] sm:text-sm">Contributors</span>
          </Link>
          <div className="ml-1 sm:ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Desktop Join Community button - separate from navbar */}
        <motion.a
          href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden sm:flex items-center gap-2 ml-3 bg-[#4AC959] text-white border-4 ${isLight ? "border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)]"} rounded-none px-4 py-2.5 hover:translate-y-1 hover:translate-x-1 transition-all`}
          whileTap={{ scale: 0.98 }}
        >
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold">Join Community</span>
        </motion.a>
      </motion.nav>

      {/* Mobile floating WhatsApp button */}
      <motion.a
        href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
        target="_blank"
        rel="noopener noreferrer"
        className={`sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-[#4AC959] text-white border-4 ${isLight ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </>
  );
};
