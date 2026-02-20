'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import JobListings from '@/components/JobListings'
import { ArrowLeft, Brain, CheckCircle, FileText, Target, TrendingUp, Users, Zap } from 'lucide-react'

interface AnalysisResult {
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  skills: string[]
  experience: {
    years: number
    level: string
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
}

export default function ResultsPage() {
  const { status } = useSession()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [jobSuggestions, setJobSuggestions] = useState<AnalysisResult['jobMatches']>([])
  const [jobsLoading, setJobsLoading] = useState(false)

  useEffect(() => {
    // Check authentication first
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const analysisData = urlParams.get('analysis')
    let parsedAnalysis: AnalysisResult | null = null
    if (analysisData) {
      try {
        parsedAnalysis = JSON.parse(decodeURIComponent(analysisData))
        setAnalysis(parsedAnalysis)
      } catch (error) {
        console.error('Error parsing analysis data:', error)
        parsedAnalysis = getDemoAnalysis()
        setAnalysis(parsedAnalysis)
      }
    } else {
      parsedAnalysis = getDemoAnalysis()
      setAnalysis(parsedAnalysis)
    }
    setLoading(false)
    
    if (parsedAnalysis) {
      setJobsLoading(true)
      fetch('/api/jobs/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: parsedAnalysis.skills,
          experience: parsedAnalysis.experience.years,
          jobTitle: parsedAnalysis.jobMatches?.[0]?.title || '',
          location: 'San Francisco'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.jobs) setJobSuggestions(data.jobs)
        })
        .catch(err => console.error('Job suggestion fetch error:', err))
        .finally(() => setJobsLoading(false))
    }
  }, [status])

  const getDemoAnalysis = (): AnalysisResult => ({
    overallScore: 78,
    strengths: [
      'Strong technical background in software development',
      'Relevant work experience in the field',
      'Good educational qualifications',
      'Clear career progression'
    ],
    weaknesses: [
      'Limited leadership experience mentioned',
      'Could benefit from more quantified achievements',
      'Missing some key industry keywords'
    ],
    suggestions: [
      'Add quantified achievements with specific numbers',
      'Include more action verbs in job descriptions',
      'Highlight leadership and team collaboration skills',
      'Add relevant certifications or courses'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    experience: {
      years: 5,
      level: 'senior',
      summary: 'Software development experience with web technologies'
    },
    education: {
      degree: 'Bachelor',
      field: 'Computer Science',
      institution: 'University of Technology'
    },
    jobMatches: [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        matchScore: 92,
        description: 'Full-stack development role with React and Node.js',
        requirements: ['JavaScript', 'React', 'Node.js', 'Leadership']
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        matchScore: 88,
        description: 'Building scalable web applications',
        requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript']
      },
      {
        title: 'Software Developer',
        company: 'Enterprise Solutions',
        matchScore: 85,
        description: 'Enterprise software development',
        requirements: ['JavaScript', 'React', 'Node.js', 'SQL']
      }
    ],
    keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
    atsScore: 75,
    recommendations: {
      immediate: [
        'Add quantified achievements with specific numbers',
        'Include more action verbs in job descriptions'
      ],
      longTerm: [
        'Develop leadership skills',
        'Get relevant certifications'
      ],
      skills: ['TypeScript', 'AWS', 'Docker']
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your analysis...</p>
        </div>
      </div>
    )
  }

  // Show authentication required if not logged in
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Account Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please create an account to view your resume analysis results
            </p>
          </div>
          <div className="space-y-4">
            <Link href="/signup">
              <Button size="lg" className="w-full">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full">
                Already have an account? Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Analysis Found</h1>
          <Link href="/upload">
            <Button>Upload Resume</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HireMe.AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Resume Analysis
            </h1>
            <p className="text-xl text-gray-600">
              AI-powered insights to optimize your career
            </p>
          </div>

          {/* Overall Score */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Overall Resume Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="text-6xl font-bold text-blue-600">
                  {analysis.overallScore}
                </div>
                <div className="flex-1">
                  <Progress value={analysis.overallScore} className="h-4 mb-2" />
                  <p className="text-sm text-gray-600">
                    Your resume scores {analysis.overallScore}% based on ATS optimization and content quality
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ATS Score: {analysis.atsScore}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Strengths
                </CardTitle>
                <CardDescription>
                  What makes your resume stand out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Target className="mr-2 h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription>
                  Opportunities to enhance your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-4 w-4 bg-orange-100 rounded-full mt-1 mr-3 flex-shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                AI Recommendations
              </CardTitle>
              <CardDescription>
                Specific actions to improve your resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Immediate Actions</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Long-term Goals</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Skills to Develop</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.skills.map((skill, index) => (
                      <li key={index} className="text-sm text-gray-600">• {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Job Suggestions */}
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                LinkedIn Job Opportunities
              </CardTitle>
              <CardDescription>
                Real job postings from LinkedIn that match your profile and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JobListings 
                skills={analysis.skills}
                experience={analysis.experience}
                onJobClick={(job) => {
                  console.log('Job clicked:', job)
                  // You can add additional logic here if needed
                }}
              />
            </CardContent>
          </Card>

          {/* Traditional Job Matches (Fallback) */}

          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Additional Job Matches
              </CardTitle>
              <CardDescription>
                More opportunities that align with your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center text-gray-500">Fetching job suggestions...</div>
              ) : jobSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {jobSuggestions.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{job.company}</span>
                          {job.matchScore && (
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {job.matchScore}% match
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                      {job.matchScore && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.matchScore}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">No job suggestions found.</div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Experience Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Skills Detected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Experience Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Years:</strong> {analysis.experience.years} years</p>
                  <p className="text-sm"><strong>Level:</strong> {analysis.experience.level}</p>
                  <p className="text-sm"><strong>Summary:</strong> {analysis.experience.summary}</p>
                  <p className="text-sm"><strong>Education:</strong> {analysis.education.degree} in {analysis.education.field}</p>
                  {analysis.education.institution && (
                    <p className="text-sm"><strong>Institution:</strong> {analysis.education.institution}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <Button size="lg" className="w-full sm:w-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Another Resume
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
