"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageCircle, Home, Github, Users } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { useTheme } from "@/contexts/ThemeContext"
import { usePathname } from "next/navigation"
import { lightTheme, darkTheme, commonColors } from "@/constants/colors"

export const Navbar = () => {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const pathname = usePathname()
  const colors = isLight ? lightTheme : darkTheme
  const shadowColor = isLight
    ? commonColors.shadowLight
    : commonColors.shadowDark

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-40 flex justify-center sm:justify-end sm:top-6 sm:right-8 sm:left-auto sm:px-0"
      >
        <div
          className="flex items-center justify-between border-4 rounded-none p-1 w-[calc(100%-2rem)] sm:w-auto sm:mx-0"
          style={{
            backgroundColor: colors.backgroundCard,
            borderColor: colors.border,
            boxShadow: `6px 6px 0px 0px ${shadowColor}`,
          }}
        >
          <Link
            href="/"
            className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              isLight
                ? "hover:bg-neo-secondary-light"
                : "hover:bg-neo-primary-dark hover:text-[#121212]"
            }`}
            style={{
              backgroundColor:
                pathname === "/"
                  ? isLight
                    ? colors.secondary
                    : colors.primary
                  : "transparent",
              color: pathname === "/" ? colors.textOnPrimary : colors.text,
            }}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <a
            href="https://github.com/swymbnsl/EZCrack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors"
            style={{ color: colors.text }}
          >
            <Github className="w-4 h-4" />
            <span className="inline">GitHub</span>
          </a>
          <Link
            href="/contributors"
            className={`flex items-center justify-center gap-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
              isLight
                ? "hover:bg-neo-secondary-light"
                : "hover:bg-neo-primary-dark hover:text-[#121212]"
            }`}
            style={{
              backgroundColor:
                pathname === "/contributors"
                  ? isLight
                    ? colors.secondary
                    : colors.primary
                  : "transparent",
              color:
                pathname === "/contributors"
                  ? colors.textOnPrimary
                  : colors.text,
            }}
          >
            <Users className="w-4 h-4" />
            <span className="text-[11px] sm:text-sm">Contributors</span>
          </Link>
          <div className="ml-1 sm:ml-2">
            <ThemeToggle />
          </div>
        </div>

        <motion.a
          href="https://chat.whatsapp.com/C3GiFPCLBob97COM0fXwI8"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 ml-3 bg-[#4AC959] text-white border-4 rounded-none px-4 py-2.5 hover:translate-y-1 hover:translate-x-1 transition-all"
          style={{
            borderColor: colors.border,
            boxShadow: `6px 6px 0px 0px ${shadowColor}`,
          }}
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
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 bg-[#4AC959] text-white border-4"
        style={{
          borderColor: colors.border,
          boxShadow: `4px 4px 0px 0px ${shadowColor}`,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>
    </>
  )
}
