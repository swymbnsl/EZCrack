import { motion } from "framer-motion"
import { UnitCard } from "@/components/units/UnitCard"
import { EmptyState } from "@/components/ui/EmptyState"
import { BookOpen } from "lucide-react"
import { sortUnitsByNumber } from "@/utils"
import type { Unit } from "@/types"

interface SubjectUnitsViewProps {
  units: Unit[]
  branchId: string
  semId: string
  subjectId: string
}

export function SubjectUnitsView({
  units,
  branchId,
  semId,
  subjectId,
}: SubjectUnitsViewProps) {
  if (units.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyState
          icon={BookOpen}
          title="No Units Available"
          description="This subject doesn't have any units yet. Check back later for updates."
        />
      </div>
    )
  }

  return (
    <motion.div
      key="units"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
    >
      {sortUnitsByNumber(units).map((unit, index) => (
        <UnitCard
          key={unit._id}
          unit={{
            ...unit,
            topics: Array.isArray(unit.topics) ? (unit.topics as string[]) : [],
          }}
          index={index}
          branchId={branchId}
          semId={semId}
          subjectId={subjectId}
        />
      ))}
    </motion.div>
  )
}
