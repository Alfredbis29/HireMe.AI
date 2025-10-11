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
}

export async function POST(request: NextRequest) {
  try {
    const { skills, experience, location, jobTitle } = await request.json()

    // Mock job data - In a real implementation, you would integrate with LinkedIn API
    // or other job search APIs like Indeed, Glassdoor, etc.
    const mockJobs: JobListing[] = [
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
        postedDate: '2024-01-15',
        applyUrl: 'https://linkedin.com/jobs/view/1234567890',
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
        postedDate: '2024-01-14',
        applyUrl: 'https://linkedin.com/jobs/view/1234567891',
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
        postedDate: '2024-01-13',
        applyUrl: 'https://linkedin.com/jobs/view/1234567892',
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
        postedDate: '2024-01-12',
        applyUrl: 'https://linkedin.com/jobs/view/1234567893',
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
        postedDate: '2024-01-11',
        applyUrl: 'https://linkedin.com/jobs/view/1234567894',
        linkedinUrl: 'https://linkedin.com/company/cloudscale'
      }
    ]

    // Filter jobs based on user skills and experience
    let filteredJobs = mockJobs

    if (skills && skills.length > 0) {
      filteredJobs = mockJobs.filter(job => 
        job.skills.some(skill => 
          skills.some((userSkill: string) => 
            skill.toLowerCase().includes(userSkill.toLowerCase()) ||
            userSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    }

    if (jobTitle) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
        jobTitle.toLowerCase().includes(job.title.toLowerCase())
      )
    }

    // Sort by relevance (jobs with more matching skills first)
    filteredJobs.sort((a, b) => {
      const aMatches = skills ? a.skills.filter(skill => 
        skills.some((userSkill: string) => 
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length : 0
      
      const bMatches = skills ? b.skills.filter(skill => 
        skills.some((userSkill: string) => 
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).length : 0
      
      return bMatches - aMatches
    })

    // Limit to top 5 most relevant jobs
    const topJobs = filteredJobs.slice(0, 5)

    return NextResponse.json({
      jobs: topJobs,
      total: topJobs.length,
      searchCriteria: {
        skills,
        experience,
        location,
        jobTitle
      }
    })

  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    )
  }
}
