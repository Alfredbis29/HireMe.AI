import { useState, useCallback } from 'react'
import { ResumeAnalysisResponse } from '@/types/resume'
import { analyzeResume } from '@/lib/api'

interface UseResumeAnalysisReturn {
  analysis: ResumeAnalysisResponse | null
  loading: boolean
  error: string | null
  analyzeResumeText: (resumeText: string, jobTitle?: string, industry?: string) => Promise<void>
  clearAnalysis: () => void
  clearError: () => void
}

export const useResumeAnalysis = (): UseResumeAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ResumeAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeResumeText = useCallback(async (
    resumeText: string,
    jobTitle?: string,
    industry?: string
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await analyzeResume(resumeText, jobTitle, industry)
      setAnalysis(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Resume analysis error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    analysis,
    loading,
    error,
    analyzeResumeText,
    clearAnalysis,
    clearError
  }
}
