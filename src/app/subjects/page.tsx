"use client";

import { useSearchParams } from "next/navigation";

export default function SubjectsPage() {
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch");
  const sem = searchParams.get("sem");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          {branch?.toUpperCase()} - Semester {sem}
        </h1>
        {/* Add your subjects list here */}
      </div>
    </div>
  );
}
