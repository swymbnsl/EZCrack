"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import axios from "axios"

interface Subject {
  _id: string
  name: string
}

interface Contributor {
  _id: string
  name: string
  branch: string
  semester: number
  avatar: string
  linkedinUrl?: string
  subject_ids: Subject[]
}

interface ContributorsContextType {
  contributors: Contributor[]
  isLoading: boolean
  error: string | null
  getContributorBySubjectId: (subjectId: string) => Contributor | undefined
}

const ContributorsContext = createContext<ContributorsContextType | undefined>(
  undefined
)

export const ContributorsProvider = ({ children }: { children: ReactNode }) => {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("/api/contributors")
        setContributors(response.data.contributors)
        setError(null)
      } catch (err) {
        console.error("Error fetching contributors:", err)
        setError("Failed to fetch contributors")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributors()
  }, [])

  const getContributorBySubjectId = (subjectId: string) => {
    return contributors.find((contributor) =>
      contributor.subject_ids.some((subject) => subject._id === subjectId)
    )
  }

  return (
    <ContributorsContext.Provider
      value={{
        contributors,
        isLoading,
        error,
        getContributorBySubjectId,
      }}
    >
      {children}
    </ContributorsContext.Provider>
  )
}

export const useContributors = () => {
  const context = useContext(ContributorsContext)
  if (context === undefined) {
    throw new Error(
      "useContributors must be used within a ContributorsProvider"
    )
  }
  return context
}
