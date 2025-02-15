"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ContentCard } from "@/components/ui/ContentCard";

interface SubjectCardProps {
  name: string;
  id: string;
  index: number;
  variants: any;
}

export const SubjectCard = ({
  name,
  id,
  index,
  variants,
}: SubjectCardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const branch = searchParams.get("branch");
  const sem = searchParams.get("sem");

  const handleClick = () => {
    router.push(`/subjects/units?branch=${branch}&sem=${sem}&subject_id=${id}`);
  };

  return (
    <ContentCard
      title={name}
      subtitle={`#${String(index + 1).padStart(2, "0")}`}
      onClick={handleClick}
      variants={variants}
    />
  );
};
