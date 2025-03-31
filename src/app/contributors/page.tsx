"use client";

import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import axios from "axios";
import Image from "next/image";

interface Contributor {
  _id: string;
  name: string;
  branch: string;
  semester: number;
  avatar: string;
  linkedinUrl?: string;
  subject_ids: {
    name: string;
    _id: string;
  }[];
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await axios.get('/api/contributors');
        setContributors(response.data.contributors);
      } catch (error) {
        console.error("Error fetching contributors:", error);
        setContributors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <PageWrapper>
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`min-h-screen pt-32 px-4 max-w-6xl mx-auto ${isLight ? "text-[#2D2A32]" : "text-white"}`}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <h1 className={`text-4xl font-bold mb-4 ${isLight ? "text-[#2D2A32]" : "text-white"}`}>
            Our Contributors
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isLight ? "text-[#2D2A32]/80" : "text-gray-300"}`}>
            Meet the amazing people who have provided study materials and made EZCrack better for everyone.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className={`w-12 h-12 border-4 ${
              isLight 
                ? "border-[#76ABAE]/30 border-t-[#76ABAE]" 
                : "border-[#4ECDC4]/30 border-t-[#4ECDC4]"
            } rounded-full animate-spin`}></div>
          </div>
        ) : contributors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((contributor) => (
              <motion.div
                key={contributor._id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`${
                  isLight 
                    ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                    : "bg-[#1E1E1E] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]"
                } border-4 p-6 flex flex-col`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full overflow-hidden border-3 ${
                    isLight ? "border-black" : "border-white"
                  }`}>
                    <Image
                      src={contributor.avatar} 
                      alt={contributor.name} 
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isLight ? "text-black" : "text-white"}`}>
                      {contributor.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 text-xs ${
                        isLight 
                          ? "bg-[#76ABAE] text-black border-black" 
                          : "bg-[#4ECDC4] text-[#121212] border-white"
                      } border-2`}>
                        {contributor.branch}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs ${
                        isLight 
                          ? "bg-[#FFD56B] text-black border-black" 
                          : "bg-[#FFE66D] text-[#121212] border-white"
                      } border-2`}>
                        Sem {contributor.semester}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className={`text-sm space-y-2 mb-4 ${isLight ? "text-[#2D2A32]" : "text-gray-300"}`}>
                    <p className="font-medium mb-2">Contributed to:</p>
                    <div className="flex flex-wrap gap-2">
                      {contributor.subject_ids && contributor.subject_ids.map((subject) => (
                        <span
                          key={subject._id}
                          className={`inline-flex items-center px-2 py-1 text-xs ${
                            isLight 
                    ? "bg-[#FF7B54] text-black border-black" 
                    : "bg-[#FF6B6B] text-[#121212] border-white"
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
                        ? "bg-[#0A66C2] text-white border-black hover:bg-[#004182]" 
                        : "bg-[#0A66C2] text-white border-white hover:bg-[#004182]"
                    } transition-colors`}
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="font-medium">Connect</span>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No Contributors Yet"
            description="Be the first to contribute study materials to EzCrack and help make it better for everyone!"
            iconColor={isLight ? "text-[#76ABAE]" : "text-[#4ECDC4]"}
          />
        )}
      </motion.main>
    </PageWrapper>
  );
}
