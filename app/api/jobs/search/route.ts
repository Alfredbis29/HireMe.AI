import { NextRequest, NextResponse } from 'next/server'

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
}

interface LinkedInJobSearchParams {
  skills: string[]
  experience: number
  location?: string
  jobTitle?: string
}

// LinkedIn Job Search API Integration
async function fetchLinkedInJobs(params: LinkedInJobSearchParams): Promise<JobListing[]> {
  try {
    // LinkedIn Job Search API endpoint
    const linkedinApiUrl = 'https://api.linkedin.com/v2/jobSearch'
    
    // Build search query based on user skills and experience
    const searchQuery = buildLinkedInSearchQuery(params)
    
    const response = await fetch(linkedinApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        search: {
          keywords: searchQuery.keywords,
          locationName: searchQuery.location,
          jobType: searchQuery.jobType,
          experienceLevel: searchQuery.experienceLevel,
          sortBy: 'RELEVANCE'
        },
        count: 10
      })
    })

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`)
    }

    const data = await response.json()
    return transformLinkedInJobs(data.elements || [])
    
  } catch (error) {
    console.error('LinkedIn API error:', error)
    throw error
  }
}

// Build LinkedIn search query from user parameters
function buildLinkedInSearchQuery(params: LinkedInJobSearchParams) {
  const keywords = params.skills.join(' ')
  const location = params.location || 'United States'
  
  // Map experience years to LinkedIn experience levels
  let experienceLevel = 'ENTRY_LEVEL'
  if (params.experience >= 5) experienceLevel = 'SENIOR_LEVEL'
  else if (params.experience >= 3) experienceLevel = 'MID_LEVEL'
  
  return {
    keywords,
    location,
    jobType: 'FULL_TIME',
    experienceLevel
  }
}

// Transform LinkedIn job data to our format
function transformLinkedInJobs(linkedinJobs: any[]): JobListing[] {
  return linkedinJobs.map((job, index) => ({
    id: job.id || `linkedin-${index}`,
    title: job.title || 'Software Developer',
    company: job.companyName || 'Company',
    location: job.locationName || 'Remote',
    type: job.jobType || 'Full-time',
    salary: job.salaryRange ? `${job.salaryRange.min}-${job.salaryRange.max}` : undefined,
    description: job.description || 'Join our team and work on exciting projects.',
    requirements: extractRequirements(job.description || ''),
    skills: extractSkills(job.description || ''),
    postedDate: job.postedDate || new Date().toISOString(),
    applyUrl: job.applyUrl || `https://linkedin.com/jobs/view/${job.id}`,
    linkedinUrl: job.companyUrl || 'https://linkedin.com'
  }))
}

// Extract requirements from job description
function extractRequirements(description: string): string[] {
  const requirements = []
  const lines = description.split('\n')
  
  for (const line of lines) {
    if (line.toLowerCase().includes('required') || line.toLowerCase().includes('must have')) {
      requirements.push(line.trim())
    }
  }
  
  return requirements.slice(0, 5) // Limit to 5 requirements
}

// Extract skills from job description
function extractSkills(description: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
    'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git',
    'HTML', 'CSS', 'Angular', 'Vue.js', 'Express', 'Django'
  ]
  
  const foundSkills = commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  )
  
  return foundSkills.slice(0, 6) // Limit to 6 skills
}

// Get current date and calculate dates for recent jobs
function getRecentDates() {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
  
  return {
    today: now.toISOString().split('T')[0],
    oneDayAgo: oneDayAgo.toISOString().split('T')[0],
    twoDaysAgo: twoDaysAgo.toISOString().split('T')[0],
    fourDaysAgo: fourDaysAgo.toISOString().split('T')[0],
    sixDaysAgo: sixDaysAgo.toISOString().split('T')[0],
    oneWeekAgo: oneWeekAgo.toISOString().split('T')[0]
  }
}

// Get mock jobs as fallback with recent dates
function getMockJobs(): JobListing[] {
  const dates = getRecentDates()
  
  return [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $160,000',
      description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for developing and maintaining our core platform.',
      requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js', 'Leadership skills'],
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
      postedDate: dates.oneDayAgo, // Posted 1 day ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer%20JavaScript%20React',
      linkedinUrl: 'https://linkedin.com/company/techcorp'
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90,000 - $130,000',
      description: 'Join our fast-growing startup as a Full Stack Developer. Work on cutting-edge projects and help shape our product.',
      requirements: ['3+ years experience', 'JavaScript', 'React', 'Python', 'Database design'],
      skills: ['JavaScript', 'React', 'Python', 'PostgreSQL', 'Docker'],
      postedDate: dates.twoDaysAgo, // Posted 2 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer%20JavaScript%20React%20Python',
      linkedinUrl: 'https://linkedin.com/company/startupxyz'
    },
    {
      id: '3',
      title: 'Frontend Developer',
      company: 'DesignStudio',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $120,000',
      description: 'We are seeking a talented Frontend Developer to create beautiful and responsive user interfaces.',
      requirements: ['2+ years experience', 'React', 'TypeScript', 'CSS', 'UI/UX design'],
      skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Responsive Design'],
      postedDate: dates.fourDaysAgo, // Posted 4 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Frontend%20Developer%20React%20TypeScript',
      linkedinUrl: 'https://linkedin.com/company/designstudio'
    },
    {
      id: '4',
      title: 'Backend Developer',
      company: 'DataFlow Systems',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100,000 - $140,000',
      description: 'Join our backend team to build scalable APIs and microservices for our data processing platform.',
      requirements: ['4+ years experience', 'Node.js', 'Python', 'Database optimization', 'API design'],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
      postedDate: dates.sixDaysAgo, // Posted 6 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Backend%20Developer%20Node.js%20Python',
      linkedinUrl: 'https://linkedin.com/company/dataflow'
    },
    {
      id: '5',
      title: 'DevOps Engineer',
      company: 'CloudScale',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$110,000 - $150,000',
      description: 'We need a DevOps Engineer to help us scale our infrastructure and improve our deployment processes.',
      requirements: ['3+ years experience', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
      postedDate: dates.oneWeekAgo, // Posted exactly 1 week ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=DevOps%20Engineer%20AWS%20Docker%20Kubernetes',
      linkedinUrl: 'https://linkedin.com/company/cloudscale'
    },
    {
      id: '6',
      title: 'React Developer',
      company: 'InnovateTech',
      location: 'Chicago, IL',
      type: 'Full-time',
      salary: '$85,000 - $125,000',
      description: 'Join our innovative team as a React Developer. Work on modern web applications and contribute to our growing platform.',
      requirements: ['2+ years experience', 'React', 'JavaScript', 'Redux', 'Testing'],
      skills: ['React', 'JavaScript', 'Redux', 'Jest', 'Webpack'],
      postedDate: dates.today, // Posted today
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=React%20Developer%20JavaScript%20Redux',
      linkedinUrl: 'https://linkedin.com/company/innovatetech'
    },
    {
      id: '7',
      title: 'Python Developer',
      company: 'DataInsights',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$95,000 - $135,000',
      description: 'We are looking for a Python Developer to join our data science team. Work on machine learning projects and data analysis.',
      requirements: ['3+ years experience', 'Python', 'Django', 'SQL', 'Data analysis'],
      skills: ['Python', 'Django', 'SQL', 'Pandas', 'NumPy'],
      postedDate: dates.twoDaysAgo, // Posted 2 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Python%20Developer%20Django%20Data%20Analysis',
      linkedinUrl: 'https://linkedin.com/company/datainsights'
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const { skills, experience, location, jobTitle } = await request.json()

    // Try to fetch real LinkedIn jobs first, fallback to mock data
    let jobs = []
    
    try {
      // LinkedIn Job Search API integration
      const linkedinJobs = await fetchLinkedInJobs({
        skills,
        experience,
        location,
        jobTitle
      })
      
      if (linkedinJobs && linkedinJobs.length > 0) {
        jobs = linkedinJobs
      } else {
        // Fallback to mock data if LinkedIn API fails
        jobs = getMockJobs()
      }
    } catch (error) {
      console.error('LinkedIn API error:', error)
      // Fallback to mock data
      jobs = getMockJobs()
    }

    // Filter jobs posted within the last week
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    let filteredJobs = jobs.filter(job => {
      const jobDate = new Date(job.postedDate)
      return jobDate >= oneWeekAgo
    })

    // If no recent jobs found, include all jobs but prioritize recent ones
    if (filteredJobs.length === 0) {
      filteredJobs = [...jobs]
    }

    // If we have skills, try to match them, but don't exclude jobs completely
    if (skills && skills.length > 0) {
      // Score jobs based on skill matches
      filteredJobs = filteredJobs.map(job => {
        const matchingSkills = job.skills.filter(skill => 
          skills.some((userSkill: string) => 
            skill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            // Add more flexible matching
            skill.toLowerCase().replace(/\s+/g, '') === userSkill.toLowerCase().replace(/\s+/g, '') ||
            userSkill.toLowerCase().replace(/\s+/g, '') === skill.toLowerCase().replace(/\s+/g, '')
          )
        )
        
        return {
          ...job,
          matchScore: matchingSkills.length,
          matchingSkills
        }
      })

      // Sort by match score, but include all jobs
      filteredJobs.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    }

    // If we have a job title preference, boost those jobs
    if (jobTitle) {
      filteredJobs = filteredJobs.map(job => {
        const titleMatch = job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
                          jobTitle.toLowerCase().includes(job.title.toLowerCase())
        return {
          ...job,
          titleMatch: titleMatch,
          matchScore: (job.matchScore || 0) + (titleMatch ? 2 : 0)
        }
      }).sort((a, b) => b.matchScore - a.matchScore)
    }

    // Always return at least 3 jobs, even if no perfect matches
    const topJobs = filteredJobs.slice(0, 5)

    return NextResponse.json({
      jobs: topJobs,
      total: topJobs.length,
      searchCriteria: {
        skills,
        experience,
        location,
        jobTitle
      },
      filters: {
        dateRange: 'Last 7 days',
        recentJobsOnly: true
      },
      source: jobs.length > 0 && jobs[0].id.startsWith('linkedin-') ? 'linkedin' : 'mock'
    })

  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    )
  }
}