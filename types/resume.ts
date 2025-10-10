export interface ResumeAnalysisRequest {
  resumeText: string
  jobTitle?: string
  industry?: string
}

export interface ResumeAnalysisResponse {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  skills: string[]
  experience: {
    years: number
    level: 'entry' | 'mid' | 'senior' | 'executive'
    summary: string
  }
  education: {
    degree: string
    field: string
    institution?: string
  }
  jobMatches: Array<{
    title: string
    company: string
    matchScore: number
    description: string
    requirements: string[]
  }>
  keywords: string[]
  atsScore: number
  recommendations: {
    immediate: string[]
    longTerm: string[]
    skills: string[]
  }
  metadata?: {
    analyzedAt: string
    model: string
    version: string
  }
}

export interface JobMatch {
  title: string
  company: string
  matchScore: number
  description: string
  requirements: string[]
}

export interface Experience {
  years: number
  level: 'entry' | 'mid' | 'senior' | 'executive'
  summary: string
}

export interface Education {
  degree: string
  field: string
  institution?: string
}

export interface Recommendations {
  immediate: string[]
  longTerm: string[]
  skills: string[]
}
