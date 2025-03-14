import { motion } from "framer-motion";
import { BookOpen, Linkedin } from "lucide-react";
import Image from "next/image";

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
  return (
    <div className="flex-1 lg:w-[30vw]">
      <div className="bg-gy-800/50 rounded-xl p-3 sm:p-4 border border-gray-700/50">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
              <Image
                src={contributor.avatar}
                alt={contributor.name}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <h3 className="font-medium text-white text-sm sm:text-base truncate">
                {contributor.name}
              </h3>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                • Contributor
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400">
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-gray-800/50 rounded-full truncate">
                {contributor.branch}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-gray-800/50 rounded-full whitespace-nowrap">
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
            className="p-1.5 sm:p-2 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors flex items-center justify-center self-center shrink-0"
          >
            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
