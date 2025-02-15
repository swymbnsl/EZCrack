import { motion } from "framer-motion";
import { BookOpen, Linkedin } from "lucide-react";

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
    <div className="flex-1 px-8">
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-purple-400" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white">{contributor.name}</h3>
              <span className="text-xs text-gray-400">• Contributor</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/50 rounded-full">
                {contributor.branch}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-800/50 rounded-full">
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
            className="p-2 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors flex items-center justify-center self-center"
          >
            <Linkedin className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
