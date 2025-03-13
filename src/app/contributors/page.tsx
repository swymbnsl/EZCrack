"use client";

import { motion } from "framer-motion";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Navbar } from "@/components/layout/Navbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users, Github } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  branch: string;
  semester: number;
  contributions: number;
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching contributors
    const fetchContributors = async () => {
      try {
        // In a real app, you would fetch from an API
        // const response = await axios.get('/api/contributors');
        // setContributors(response.data.contributors);

        // For now, we'll use an empty array to show the empty state
        setContributors([]);
      } catch (error) {
        console.error("Error fetching contributors:", error);
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
        className="min-h-screen pt-32 px-4 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
            Our Contributors
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Meet the amazing people who have contributed to EzCrack and helped
            make it better for everyone.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : contributors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contributors would be mapped here */}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No Contributors Yet"
            description="Be the first to contribute to EzCrack and help make it better for everyone!"
            action={{
              label: "Contribute on GitHub",
              onClick: () =>
                window.open("https://github.com/swymbnsl/ezcrack", "_blank"),
            }}
          />
        )}
      </motion.main>
    </PageWrapper>
  );
}
