"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
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

// Create a singleton instance to track if data has been fetched
let contributorsData: Contributor[] = []
let isFetching = false
let fetchPromise: Promise<void> | null = null

export const ContributorsProvider = ({ children }: { children: ReactNode }) => {
  const [contributors, setContributors] =
    useState<Contributor[]>(contributorsData)
  const [isLoading, setIsLoading] = useState(!contributorsData.length)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    const fetchContributors = async () => {
      // If we already have data, don't fetch again
      if (contributorsData.length > 0) {
        setIsLoading(false)
        return
      }

      // If we're already fetching, wait for that promise to resolve
      if (isFetching && fetchPromise) {
        await fetchPromise
        return
      }

      try {
        isFetching = true
        setIsLoading(true)

        // Create a new promise for this fetch
        fetchPromise = (async () => {
          const response = await axios.get("/api/contributors")
          contributorsData = response.data.contributors

          if (isMounted.current) {
            setContributors(contributorsData)
            setError(null)
          }
        })()

        await fetchPromise
      } catch (err) {
        console.error("Error fetching contributors:", err)
        if (isMounted.current) {
          setError("Failed to fetch contributors")
        }
      } finally {
        isFetching = false
        if (isMounted.current) {
          setIsLoading(false)
        }
      }
    }

    fetchContributors()

    return () => {
      isMounted.current = false
    }
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
