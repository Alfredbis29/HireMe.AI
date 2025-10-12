'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Linkedin, Calendar } from 'lucide-react'

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  description: string
  requirements: string[]
  skills: string[]
  postedDate: string
  applyUrl: string
  linkedinUrl: string
  matchScore?: number
  matchingSkills?: string[]
}

interface JobListingsProps {
  skills: string[]
  experience: {
    years: number
    level: string
  }
  onJobClick?: (job: JobListing) => void
}

export default function JobListings({ skills, experience, onJobClick }: JobListingsProps) {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInfo, setSearchInfo] = useState<{filters?: {dateRange?: string, recentJobsOnly?: boolean}}>({})

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/jobs/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skills,
            experience: experience.years,
            jobTitle: experience.level
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch jobs')
        }

        const data = await response.json()
        setJobs(data.jobs || [])
        setSearchInfo(data)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        // Fallback: show some default jobs even if API fails
        const fallbackJobs = [
          {
            id: 'fallback-1',
            title: 'Software Developer',
            company: 'Tech Company',
            location: 'Remote',
            type: 'Full-time',
            salary: '$70,000 - $100,000',
            description: 'Join our development team and work on exciting projects.',
            requirements: ['Programming experience', 'Problem solving', 'Team work'],
            skills: ['JavaScript', 'Python', 'SQL'],
            postedDate: '2024-01-15',
            applyUrl: 'https://linkedin.com/jobs',
            linkedinUrl: 'https://linkedin.com'
          },
          {
            id: 'fallback-2',
            title: 'Web Developer',
            company: 'Digital Agency',
            location: 'Various Locations',
            type: 'Full-time',
            salary: '$60,000 - $90,000',
            description: 'Create beautiful websites and web applications.',
            requirements: ['HTML/CSS', 'JavaScript', 'Responsive design'],
            skills: ['HTML', 'CSS', 'JavaScript'],
            postedDate: '2024-01-14',
            applyUrl: 'https://linkedin.com/jobs',
            linkedinUrl: 'https://linkedin.com'
          }
        ]
        setJobs(fallbackJobs)
        setError('') // Clear error since we have fallback jobs
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [skills, experience])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const handleApply = (job: JobListing) => {
    if (onJobClick) {
      onJobClick(job)
    }
    // Open LinkedIn job search with relevant keywords
    window.open(job.applyUrl, '_blank')
  }

  const handleLinkedIn = (job: JobListing) => {
    // Open LinkedIn company page or job search
    window.open(job.linkedinUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding relevant job opportunities...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Recommended Jobs for You
        </h2>
        <p className="text-gray-600 mb-4">
          Based on your skills and experience, here are the best opportunities
        </p>
        
        {/* Date Filter Info */}
        {searchInfo.filters?.recentJobsOnly && (
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Showing jobs posted in the last 7 days
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company} - {job.location}</p>
                  <p className="text-sm text-gray-500">{job.type} • {formatDate(job.postedDate)}</p>
                  {job.salary && <p className="text-sm text-gray-700 font-medium">{job.salary}</p>}
                </div>
                <Link href={job.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-6 w-6 text-blue-600 hover:text-blue-800" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{job.description}</p>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  onClick={() => handleApply(job)}
                  className="flex-1"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Search Similar Jobs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLinkedIn(job)}
                  className="flex-1"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  Browse LinkedIn Jobs
                </Button>
              </div>
              
              {/* Info Message */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> This will open LinkedIn job search with relevant keywords. 
                  You can then apply to real job postings that match your skills!
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t">
        <p className="text-sm text-gray-500 mb-4">
          💡 <strong>Pro Tip:</strong> Keep your LinkedIn profile updated and active to increase your chances of being noticed by recruiters!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.open('https://linkedin.com/jobs', '_blank')}
            className="text-sm"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Browse All LinkedIn Jobs
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://linkedin.com/feed', '_blank')}
            className="text-sm"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            Update Your LinkedIn Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
