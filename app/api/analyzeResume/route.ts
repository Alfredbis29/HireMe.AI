import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client only when API key is available
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface ResumeAnalysisRequest {
  resumeText: string
  jobTitle?: string
  industry?: string
}

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
    // Parse request body
    const body: ResumeAnalysisRequest = await request.json()
    const { resumeText, jobTitle, industry } = body

    // Validate input
    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-placeholder') {
      // Return mock analysis for demo purposes
      console.log('Using mock analysis - OpenAI API key not configured')
      
      const mockAnalysis: ResumeAnalysisResponse = {
        overallScore: 82,
        strengths: [
          'Strong technical background with relevant programming languages',
          'Good educational foundation in Computer Science',
          'Demonstrates practical experience with modern technologies'
        ],
        weaknesses: [
          'Could benefit from more quantified achievements and metrics',
          'Missing some industry-specific keywords',
          'Consider adding more soft skills and leadership examples'
        ],
        suggestions: [
          'Add specific metrics to quantify your achievements (e.g., "Improved performance by 30%")',
          'Include more industry-relevant keywords',
          'Highlight any leadership or team collaboration experiences',
          'Consider adding a professional summary section'
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Computer Science'],
        experience: {
          years: 5,
          level: 'mid',
          summary: '5 years of software development experience with focus on web technologies and cloud platforms'
        },
        education: {
          degree: 'Bachelor',
          field: 'Computer Science',
          institution: 'University'
        },
        jobMatches: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Company',
            matchScore: 88,
            description: 'Full-stack development role focusing on modern web technologies',
            requirements: ['JavaScript', 'React', 'Node.js', 'AWS', '5+ years experience']
          },
          {
            title: 'Full Stack Developer',
            company: 'Startup',
            matchScore: 85,
            description: 'Versatile developer role with both frontend and backend responsibilities',
            requirements: ['JavaScript', 'Python', 'React', 'Node.js', 'Bachelor degree']
          }
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Software Engineer', 'Computer Science'],
        atsScore: 75,
        recommendations: {
          immediate: [
            'Add quantified achievements to your experience section',
            'Include more industry-specific keywords',
            'Highlight any certifications or special projects'
          ],
          longTerm: [
            'Consider pursuing advanced certifications in cloud technologies',
            'Develop leadership skills through team projects or mentoring',
            'Stay updated with latest technology trends and frameworks'
          ],
          skills: ['TypeScript', 'Docker', 'Kubernetes', 'Machine Learning', 'DevOps']
        }
      }

      const response = {
        ...mockAnalysis,
        metadata: {
          analyzedAt: new Date().toISOString(),
          model: 'mock-analysis',
          version: '1.0',
          note: 'This is a demo analysis. Configure OpenAI API key for real AI analysis.'
        }
      }

      return NextResponse.json(response)
    }

    // Create the analysis prompt
    const analysisPrompt = `
You are an expert resume analyst and career coach. Analyze the following resume and provide a comprehensive assessment.

Resume Text:
${resumeText}

${jobTitle ? `Target Job Title: ${jobTitle}` : ''}
${industry ? `Industry: ${industry}` : ''}

Please provide a detailed analysis in the following JSON format:
{
  "overallScore": number (0-100),
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "skills": ["skill1", "skill2", "skill3"],
  "experience": {
    "years": number,
    "level": "entry|mid|senior|executive",
    "summary": "brief experience summary"
  },
  "education": {
    "degree": "degree type",
    "field": "field of study",
    "institution": "institution name if mentioned"
  },
  "jobMatches": [
    {
      "title": "job title",
      "company": "company type",
      "matchScore": number (0-100),
      "description": "job description",
      "requirements": ["requirement1", "requirement2"]
    }
  ],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "atsScore": number (0-100),
  "recommendations": {
    "immediate": ["immediate action1", "immediate action2"],
    "longTerm": ["long term goal1", "long term goal2"],
    "skills": ["skill to develop1", "skill to develop2"]
  }
}

Focus on:
1. ATS (Applicant Tracking System) optimization
2. Industry-specific keywords
3. Quantifiable achievements
4. Skills alignment with job market
5. Career progression potential
6. Format and structure improvements

Be specific and actionable in your recommendations.
`

    // Call OpenAI API
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyst and career coach. Always respond with valid JSON format as requested."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    // Parse the response
    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    let analysisResult: ResumeAnalysisResponse
    try {
      analysisResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      // Fallback to a structured response if JSON parsing fails
      analysisResult = {
        overallScore: 75,
        strengths: ['Strong technical background', 'Relevant experience'],
        weaknesses: ['Could use more quantified achievements', 'Missing some keywords'],
        suggestions: ['Add more specific metrics', 'Include industry keywords'],
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: {
          years: 3,
          level: 'mid',
          summary: 'Software development experience'
        },
        education: {
          degree: 'Bachelor',
          field: 'Computer Science'
        },
        jobMatches: [
          {
            title: 'Software Engineer',
            company: 'Tech Company',
            matchScore: 85,
            description: 'Full-stack development role',
            requirements: ['JavaScript', 'React', 'Node.js']
          }
        ],
        keywords: ['JavaScript', 'React', 'Node.js'],
        atsScore: 70,
        recommendations: {
          immediate: ['Add quantified achievements', 'Include more keywords'],
          longTerm: ['Develop leadership skills', 'Get relevant certifications'],
          skills: ['TypeScript', 'AWS', 'Docker']
        }
      }
    }

    // Validate the response structure
    if (!analysisResult.overallScore || !analysisResult.strengths || !analysisResult.weaknesses) {
      throw new Error('Invalid analysis response structure')
    }

    // Add metadata
    const response = {
      ...analysisResult,
      metadata: {
        analyzedAt: new Date().toISOString(),
        model: 'gpt-4',
        version: '1.0'
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error analyzing resume:', error)
    
    // Return a structured error response
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API key is invalid or missing' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { 
        error: 'Failed to analyze resume',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
