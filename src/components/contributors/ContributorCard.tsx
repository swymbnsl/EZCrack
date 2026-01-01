"use client"

import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/contexts/ThemeContext"
import { Contributor } from "@/types"

interface ContributorCardProps {
  contributor: Contributor
}

export function ContributorCard({ contributor }: ContributorCardProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${
        isLight
          ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          : "bg-neo-card-dark border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
      } border-4 p-6 flex flex-col`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-full overflow-hidden border-3 ${
            isLight ? "border-black" : "border-white"
          }`}
        >
          <Image
            src={contributor.avatar}
            alt={contributor.name}
            className="w-full h-full object-cover"
            width={64}
            height={64}
          />
        </div>
        <div>
          <h3
            className={`text-lg font-bold ${
              isLight ? "text-black" : "text-white"
            }`}
          >
            {contributor.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center px-2 py-1 text-xs ${
                isLight
                  ? "bg-neo-primary-light text-black border-black"
                  : "bg-neo-primary-dark text-neo-bg-dark border-white"
              } border-2`}
            >
              {contributor.branch}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs ${
                isLight
                  ? "bg-neo-secondary-light text-black border-black"
                  : "bg-neo-secondary-dark text-neo-bg-dark border-white"
              } border-2`}
            >
              Sem {contributor.semester}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div
          className={`text-sm space-y-2 mb-4 ${
            isLight ? "text-neo-text-light" : "text-gray-300"
          }`}
        >
          <p className="font-medium mb-2">Contributed to:</p>
          <div className="flex flex-wrap gap-2">
            {contributor.subject_ids &&
              contributor.subject_ids.map((subject) => (
                <span
                  key={subject._id}
                  className={`inline-flex items-center px-2 py-1 text-xs ${
                    isLight
                      ? "bg-neo-accent-light text-black border-black"
                      : "bg-neo-accent-dark text-neo-bg-dark border-white"
                  } border-2`}
                >
                  {subject.name}
                </span>
              ))}
          </div>
        </div>
      </div>

      {contributor.linkedinUrl && (
        <a
          href={contributor.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 flex items-center gap-2 px-4 py-2 border-2 w-full justify-center ${
            isLight
              ? "bg-neo-linkedin text-white border-black hover:bg-neo-linkedin-hover"
              : "bg-neo-linkedin text-white border-white hover:bg-neo-linkedin-hover"
          } transition-colors`}
        >
          <Linkedin className="w-4 h-4" />
          <span className="font-medium">Connect</span>
        </a>
      )}
    </motion.div>
  )
}
