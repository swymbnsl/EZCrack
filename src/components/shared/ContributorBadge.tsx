import { motion } from "framer-motion";
import { BookOpen, Linkedin } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

interface Contributor {
  name: string;
  branch: string;
  semester: number;
  avatar: string;
  linkedinUrl: string;
}

interface ContributorBadgeProps {
  contributor: Contributor;
}

export function ContributorBadge({ contributor }: ContributorBadgeProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="flex-1 lg:w-[30vw]">
      <div className={`${
        isLight 
          ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
          : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
      } border-4 p-3 sm:p-4`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 overflow-hidden ${
              isLight 
                ? "border-black" 
                : "border-white"
            } border-3`}>
              <Image
                src={contributor.avatar}
                alt={contributor.name}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 ${
              isLight 
                ? "bg-[#FFD56B] border-black" 
                : "bg-[#4ECDC4] border-white"
            } border-2 flex items-center justify-center`}>
              <BookOpen className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isLight ? "text-black" : "text-[#121212]"}`} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3 className={`font-bold text-sm sm:text-base truncate ${isLight ? "text-black" : "text-white"}`}>
                {contributor.name}
              </h3>
              <span className={`text-xs ${isLight ? "text-[#2D2A32]" : "text-gray-400"}`}>
                • Contributor
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 ${
                isLight 
                  ? "bg-[#76ABAE] text-black border-black" 
                  : "bg-[#4ECDC4] text-[#121212] border-white"
              } border-2 truncate`}>
                {contributor.branch}
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 ${
                isLight 
                  ? "bg-[#FFD56B] text-black border-black" 
                  : "bg-[#FFE66D] text-[#121212] border-white"
              } border-2 whitespace-nowrap`}>
                Sem {contributor.semester}
              </span>
            </div>
          </div>

          <motion.a
            href={contributor.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-1.5 sm:p-2 ${
              isLight 
                ? "bg-[#FF7B54] text-black border-black hover:bg-[#FFD56B]" 
                : "bg-[#FF6B6B] text-[#121212] border-white hover:bg-[#4ECDC4]"
            } border-2 transition-colors flex items-center justify-center self-center shrink-0`}
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
