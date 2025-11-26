import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

interface ResumeAnalysisResponse {
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

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API called')

    // Require authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      console.log('❌ Upload API: No valid session found, rejecting')
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to upload files.' },
        { status: 401 }
      )
    }

    // Check content type
    const contentType = request.headers.get('content-type') || ''
    console.log('Content-Type:', contentType)

    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      file = formData.get('file') as File
      console.log('File received:', file?.name, file?.size)
    } else {
      // Handle other requests (for testing)
      console.log('Non-form data request, using mock data')
    }

    if (!file && contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Simulate processing time
    console.log('🔄 Processing resume analysis...')
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate mock analysis data
    const mockAnalysis: ResumeAnalysisResponse = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
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
        years: Math.floor(Math.random() * 5) + 2,
        level: 'mid',
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
          matchScore: Math.floor(Math.random() * 20) + 80,
          description: 'Full-stack development role with React and Node.js',
          requirements: ['JavaScript', 'React', 'Node.js', 'Leadership']
        },
        {
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          matchScore: Math.floor(Math.random() * 20) + 75,
          description: 'Building scalable web applications',
          requirements: ['JavaScript', 'React', 'Node.js', 'TypeScript']
        },
        {
          title: 'Software Developer',
          company: 'Enterprise Solutions',
          matchScore: Math.floor(Math.random() * 20) + 70,
          description: 'Enterprise software development',
          requirements: ['JavaScript', 'React', 'Node.js', 'SQL']
        }
      ],
      keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
      atsScore: Math.floor(Math.random() * 30) + 70,
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
    }

    console.log('✅ Analysis complete, returning results')
    return NextResponse.json(mockAnalysis)

  } catch (error) {
    console.error('❌ Error analyzing resume:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze resume',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}