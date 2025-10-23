'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, MapPin, Clock, DollarSign, Building, Star, Loader2 } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  salary: string
  type: string
  postedDate: string
  linkedinUrl: string
  matchScore: number
  skills: string[]
}

interface JobSearchProps {
  resumeAnalysis: {
    jobTitle?: string
    skills?: string[]
    experience?: string
    location?: string
  }
}

export default function JobSearch({ resumeAnalysis }: JobSearchProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchJobs = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/jobs/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: resumeAnalysis.jobTitle,
          location: resumeAnalysis.location,
          skills: resumeAnalysis.skills,
          experience: resumeAnalysis.experience
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for jobs')
      }

      setJobs(data.jobs)
    } catch (error) {
      console.error('Job search error:', error)
      setError('Failed to search for jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (resumeAnalysis.jobTitle || resumeAnalysis.skills) {
      searchJobs()
    }
  }, [resumeAnalysis])

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 80) return 'bg-blue-100 text-blue-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Good Match'
    if (score >= 70) return 'Fair Match'
    return 'Low Match'
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Finding Relevant Jobs...
          </CardTitle>
          <CardDescription>
            Searching LinkedIn for jobs that match your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Job Search Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={searchJobs} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            No Jobs Found
          </CardTitle>
          <CardDescription>
            We couldn't find any jobs matching your profile. Try adjusting your search criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Button onClick={searchJobs} variant="outline">
              Search Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Recommended Jobs ({jobs.length})
          </CardTitle>
          <CardDescription>
            Based on your resume analysis, here are the best matching jobs from LinkedIn
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Building className="mr-1 h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {job.postedDate}
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getMatchColor(job.matchScore)}>
                    <Star className="mr-1 h-3 w-3" />
                    {job.matchScore}% Match
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {getMatchLabel(job.matchScore)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Job Description</h4>
                  <p className="text-sm text-gray-700">{job.description}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Key Requirements</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {job.requirements.slice(0, 3).map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {req}
                      </li>
                    ))}
                    {job.requirements.length > 3 && (
                      <li className="text-gray-500">
                        +{job.requirements.length - 3} more requirements
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    asChild 
                    className="w-full"
                    onClick={() => {
                      // Track job application click
                      console.log('Job application clicked:', job.id)
                    }}
                  >
                    <a 
                      href={job.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Apply on LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-medium mb-2">Want to see more jobs?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Visit LinkedIn directly to explore more opportunities
            </p>
            <Button asChild variant="outline">
              <a 
                href="https://linkedin.com/jobs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Browse All Jobs on LinkedIn
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
