"use client"

import { Users } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { useContributors } from "@/contexts/ContributorsContext"
import { EmptyState } from "@/components/ui/EmptyState"
import { ContributorCard } from "./ContributorCard"
import { ContributorsLoading } from "./ContributorsLoading"

export function ContributorsGrid() {
  const { contributors, isLoading } = useContributors()
  const { theme } = useTheme()
  const isLight = theme === "light"

  if (isLoading) {
    return <ContributorsLoading />
  }

  if (contributors.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No Contributors Yet"
        description="Be the first to contribute study materials to EzCrack and help make it better for everyone!"
        iconColor={isLight ? "text-neo-primary-light" : "text-neo-primary-dark"}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contributors.map((contributor) => (
        <ContributorCard key={contributor._id} contributor={contributor} />
      ))}
    </div>
  )
}
