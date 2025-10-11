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
      },
      {
        id: '6',
        title: 'Software Developer',
        company: 'InnovateTech',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$70,000 - $100,000',
        description: 'Join our development team as a Software Developer. Work on exciting projects and grow your career with us.',
        requirements: ['1+ years experience', 'Programming skills', 'Problem solving', 'Team collaboration'],
        skills: ['JavaScript', 'Python', 'SQL', 'Git', 'Agile'],
        postedDate: '2024-01-10',
        applyUrl: 'https://linkedin.com/jobs/view/1234567895',
        linkedinUrl: 'https://linkedin.com/company/innovatetech'
      },
      {
        id: '7',
        title: 'Web Developer',
        company: 'Digital Agency',
        location: 'Miami, FL',
        type: 'Full-time',
        salary: '$60,000 - $90,000',
        description: 'We are looking for a Web Developer to create stunning websites and web applications for our clients.',
        requirements: ['2+ years experience', 'HTML', 'CSS', 'JavaScript', 'Responsive design'],
        skills: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'WordPress'],
        postedDate: '2024-01-09',
        applyUrl: 'https://linkedin.com/jobs/view/1234567896',
        linkedinUrl: 'https://linkedin.com/company/digitalagency'
      },
      {
        id: '8',
        title: 'Junior Developer',
        company: 'TechStart',
        location: 'Denver, CO',
        type: 'Full-time',
        salary: '$50,000 - $70,000',
        description: 'Perfect opportunity for recent graduates or career changers. We provide mentorship and growth opportunities.',
        requirements: ['Entry level', 'Basic programming knowledge', 'Eagerness to learn', 'Good communication'],
        skills: ['Programming fundamentals', 'Problem solving', 'Learning ability', 'Communication'],
        postedDate: '2024-01-08',
        applyUrl: 'https://linkedin.com/jobs/view/1234567897',
        linkedinUrl: 'https://linkedin.com/company/techstart'
      }
    ]

    // Always return jobs - don't filter too strictly
    let filteredJobs = [...mockJobs]

    // If we have skills, try to match them, but don't exclude jobs completely
    if (skills && skills.length > 0) {
      // Score jobs based on skill matches
      filteredJobs = mockJobs.map(job => {
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
      filteredJobs.sort((a, b) => b.matchScore - a.matchScore)
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
