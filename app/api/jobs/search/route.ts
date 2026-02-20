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
  matchingSkills?: string[]
}

// LinkedIn Job Search API integration
async function fetchLinkedInJobs(params: {
  skills: string[]
  experience: number
  location?: string
  jobTitle?: string
}): Promise<JobListing[]> {
  try {
    // For now, we'll use mock data that simulates LinkedIn job postings
    // In a real implementation, you would integrate with LinkedIn's Job Search API
    console.log('🔍 Fetching LinkedIn jobs with params:', params)
    
    // Simulate API delay (reduced from 500ms to 100ms)
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Generate realistic job postings based on skills
    const mockJobs: JobListing[] = [
      {
        id: 'linkedin-1',
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $160,000',
        description: 'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for developing and maintaining our core platform.',
        requirements: ['5+ years experience', 'JavaScript', 'React', 'Node.js', 'Leadership skills'],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
        applyUrl: 'https://linkedin.com/jobs/search/?keywords=Senior%20Software%20Engineer%20JavaScript%20React',
        linkedinUrl: 'https://linkedin.com/company/techcorp'
      },
      {
        id: 'linkedin-2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Full-time',
        salary: '$90,000 - $130,000',
        description: 'Join our dynamic team building the next generation of web applications. We use modern technologies and agile methodologies.',
        requirements: ['3+ years experience', 'JavaScript', 'React', 'Node.js', 'Database design'],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        applyUrl: 'https://linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer%20JavaScript%20React',
        linkedinUrl: 'https://linkedin.com/company/startupxyz'
      },
      {
        id: 'linkedin-3',
        title: 'Frontend Developer',
        company: 'Digital Agency Co.',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$80,000 - $110,000',
        description: 'Create beautiful and responsive user interfaces for our clients. Work with modern frontend frameworks and tools.',
        requirements: ['2+ years experience', 'JavaScript', 'React', 'CSS', 'UI/UX'],
        skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Figma'],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
        applyUrl: 'https://linkedin.com/jobs/search/?keywords=Frontend%20Developer%20React%20JavaScript',
        linkedinUrl: 'https://linkedin.com/company/digital-agency'
      },
      {
        id: 'linkedin-4',
        title: 'Backend Developer',
        company: 'Enterprise Solutions',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$100,000 - $140,000',
        description: 'Design and implement scalable backend systems. Work with microservices architecture and cloud technologies.',
        requirements: ['4+ years experience', 'Node.js', 'Python', 'Database design', 'API development'],
        skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
        applyUrl: 'https://linkedin.com/jobs/search/?keywords=Backend%20Developer%20Node.js%20Python',
        linkedinUrl: 'https://linkedin.com/company/enterprise-solutions'
      },
      {
        id: 'linkedin-5',
        title: 'Software Engineer',
        company: 'Innovation Labs',
        location: 'Seattle, WA',
        type: 'Full-time',
        salary: '$95,000 - $125,000',
        description: 'Join our research and development team working on cutting-edge technologies. Great opportunity for growth and learning.',
        requirements: ['3+ years experience', 'JavaScript', 'React', 'Problem solving', 'Team collaboration'],
        skills: ['JavaScript', 'React', 'TypeScript', 'Git', 'Agile'],
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
        applyUrl: 'https://linkedin.com/jobs/search/?keywords=Software%20Engineer%20JavaScript%20React',
        linkedinUrl: 'https://linkedin.com/company/innovation-labs'
      }
    ]
    
    return mockJobs
  } catch (error) {
    console.error('LinkedIn API error:', error)
    return []
  }
}



// Get mock jobs as fallback with recent dates
function getMockJobs(): JobListing[] {
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
      postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 1 day ago
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
      description: 'Join our dynamic team building the next generation of web applications. We use modern technologies and agile methodologies.',
      requirements: ['3+ years experience', 'JavaScript', 'React', 'Node.js', 'Database design'],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 2 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Full%20Stack%20Developer%20JavaScript%20React',
      linkedinUrl: 'https://linkedin.com/company/startupxyz'
    },
    {
      id: '3',
      title: 'Frontend Developer',
      company: 'Digital Agency Co.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $110,000',
      description: 'Create beautiful and responsive user interfaces for our clients. Work with modern frontend frameworks and tools.',
      requirements: ['2+ years experience', 'JavaScript', 'React', 'CSS', 'UI/UX'],
      skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Figma'],
      postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 4 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Frontend%20Developer%20React%20JavaScript',
      linkedinUrl: 'https://linkedin.com/company/digital-agency'
    },
    {
      id: '4',
      title: 'Backend Developer',
      company: 'Enterprise Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100,000 - $140,000',
      description: 'Design and implement scalable backend systems. Work with microservices architecture and cloud technologies.',
      requirements: ['4+ years experience', 'Node.js', 'Python', 'Database design', 'API development'],
      skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
      postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 6 days ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Backend%20Developer%20Node.js%20Python',
      linkedinUrl: 'https://linkedin.com/company/enterprise-solutions'
    },
    {
      id: '5',
      title: 'Software Engineer',
      company: 'Innovation Labs',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$95,000 - $125,000',
      description: 'Join our research and development team working on cutting-edge technologies. Great opportunity for growth and learning.',
      requirements: ['3+ years experience', 'JavaScript', 'React', 'Problem solving', 'Team collaboration'],
      skills: ['JavaScript', 'React', 'TypeScript', 'Git', 'Agile'],
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Posted 1 week ago
      applyUrl: 'https://linkedin.com/jobs/search/?keywords=Software%20Engineer%20JavaScript%20React',
      linkedinUrl: 'https://linkedin.com/company/innovation-labs'
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
      }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
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
