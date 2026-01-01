import axios, { AxiosInstance, AxiosError } from "axios"
import {
  SubjectsResponse,
  SubjectResponse,
  UnitsResponse,
  UnitResponse,
  QuestionsResponse,
  ContributorsResponse,
} from "@/types"

const api: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data)
    } else if (error.request) {
      console.error("Network Error:", error.message)
    } else {
      console.error("Request Error:", error.message)
    }
    return Promise.reject(error)
  }
)

// ============ Subjects API ============
export const subjectsApi = {
  /**
   * Get all subjects for a specific branch and semester
   */
  getByBranchAndSemester: async (
    branch: string,
    semester: string
  ): Promise<SubjectsResponse> => {
    const response = await api.get<SubjectsResponse>("/subjects", {
      params: { branch, sem: semester },
    })
    return response.data
  },

  /**
   * Get a single subject by ID
   */
  getById: async (subjectId: string): Promise<SubjectResponse> => {
    const response = await api.get<SubjectResponse>(`/subjects/${subjectId}`)
    return response.data
  },
}

// ============ Units API ============
export const unitsApi = {
  /**
   * Get all units for a subject
   */
  getBySubjectId: async (subjectId: string): Promise<UnitsResponse> => {
    const response = await api.get<UnitsResponse>("/units", {
      params: { subject_id: subjectId },
    })
    return response.data
  },

  /**
   * Get a single unit by ID
   */
  getById: async (unitId: string): Promise<UnitResponse> => {
    const response = await api.get<UnitResponse>(`/units/${unitId}`)
    return response.data
  },
}

// ============ Questions API ============
export const questionsApi = {
  /**
   * Get questions by unit number and subject ID
   */
  getByUnitAndSubject: async (
    unit: number,
    subjectId: string
  ): Promise<QuestionsResponse> => {
    const response = await api.get<QuestionsResponse>("/questions", {
      params: { unit, subjectId },
    })
    return response.data
  },

  /**
   * Get all questions for a subject
   */
  getBySubjectId: async (subjectId: string): Promise<QuestionsResponse> => {
    const response = await api.get<QuestionsResponse>(
      `/questions/subject/${subjectId}`
    )
    return response.data
  },
}

// ============ Contributors API ============
export const contributorsApi = {
  /**
   * Get all contributors
   */
  getAll: async (): Promise<ContributorsResponse> => {
    const response = await api.get<ContributorsResponse>("/contributors")
    return response.data
  },
}

// Export the api instance for custom requests if needed
export default api
