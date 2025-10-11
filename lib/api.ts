import axios from 'axios'
import { ResumeAnalysisRequest, ResumeAnalysisResponse } from '@/types/resume'

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export class ResumeAnalysisAPI {
  private static instance: ResumeAnalysisAPI
  private axiosInstance

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`Making API request to: ${config.url}`)
        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  public static getInstance(): ResumeAnalysisAPI {
    if (!ResumeAnalysisAPI.instance) {
      ResumeAnalysisAPI.instance = new ResumeAnalysisAPI()
    }
    return ResumeAnalysisAPI.instance
  }

  /**
   * Analyze a resume using OpenAI
   * @param resumeText - The resume text to analyze
   * @param jobTitle - Optional target job title
   * @param industry - Optional target industry
   * @returns Promise<ResumeAnalysisResponse>
   */
  async analyzeResume(
    resumeText: string,
    jobTitle?: string,
    industry?: string
  ): Promise<ResumeAnalysisResponse> {
    try {
      const requestData: ResumeAnalysisRequest = {
        resumeText,
        jobTitle,
        industry,
      }

      const response = await this.axiosInstance.post<ResumeAnalysisResponse>(
        '/api/analyzeResume',
        requestData
      )

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        throw new Error(`Resume analysis failed: ${errorMessage}`)
      }
      throw new Error('An unexpected error occurred during resume analysis')
    }
  }

  /**
   * Check if the API is available
   * @returns Promise<boolean>
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/api/health')
      return true
    } catch {
      return false
    }
  }
}

// Export a singleton instance
export const resumeAnalysisAPI = ResumeAnalysisAPI.getInstance()

// Export utility functions
export const analyzeResume = (
  resumeText: string,
  jobTitle?: string,
  industry?: string
) => resumeAnalysisAPI.analyzeResume(resumeText, jobTitle, industry)

export const checkAPIHealth = () => resumeAnalysisAPI.isAvailable()
