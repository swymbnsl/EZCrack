"use client";

import { useRouter } from "next/navigation";
import { ContentCard } from "@/components/ui/ContentCard";

interface SubjectCardProps {
  name: string;
  id: string;
  index: number;
  variants: any;
  branchId: string;
  semId: string;
}

export const SubjectCard = ({
  name,
  id,
  index,
  variants,
  branchId,
  semId,
}: SubjectCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/branch/${branchId}/semester/${semId}/subject/${id}`);
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
