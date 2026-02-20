// Example usage of the Resume Analysis API

import { analyzeResume } from './api'

// Example 1: Basic resume analysis
export async function analyzeBasicResume() {
  const resumeText = `
    John Doe
    Software Engineer
    
    Experience:
    - 3 years at TechCorp developing web applications
    - Built React applications with Node.js backend
    - Led a team of 2 developers
    
    Education:
    - Bachelor of Computer Science, University of Technology
    
    Skills:
    - JavaScript, React, Node.js, Python, SQL
  `

  try {
    const analysis = await analyzeResume(resumeText)
    console.log('Analysis Results:', analysis)
    return analysis
  } catch (error) {
    console.error('Analysis failed:', error)
    throw error
  }
}

// Example 2: Targeted analysis for specific job
export async function analyzeTargetedResume() {
  const resumeText = `
    Jane Smith
    Frontend Developer
    
    Experience:
    - 2 years at StartupXYZ
    - Built responsive web applications
    - Worked with React, TypeScript, and CSS
    
    Education:
    - Computer Science Degree
  `

  try {
    const analysis = await analyzeResume(
      resumeText,
      'Senior Frontend Developer', // Target job title
      'Technology' // Target industry
    )
    console.log('Targeted Analysis:', analysis)
    return analysis
  } catch (error) {
    console.error('Targeted analysis failed:', error)
    throw error
  }
}

// Example 3: Using the React hook
export function useResumeAnalysisExample() {
  // This would be used in a React component
  /*
  import { useResumeAnalysis } from '@/hooks/useResumeAnalysis'
  
  function MyComponent() {
    const { analysis, loading, error, analyzeResumeText } = useResumeAnalysis()
    
    const handleAnalyze = async () => {
      await analyzeResumeText('Your resume text here...')
    }
    
    return (
      <div>
        {loading && <p>Analyzing...</p>}
        {error && <p>Error: {error}</p>}
        {analysis && (
          <div>
            <h2>Score: {analysis.overallScore}/100</h2>
            <h3>Strengths:</h3>
            <ul>
              {analysis.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
  */
}

// Example 4: Error handling
export async function analyzeWithErrorHandling() {
  try {
    const analysis = await analyzeResume('')
    return analysis
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('OpenAI API key is not configured')
      } else if (error.message.includes('quota')) {
        console.error('API quota exceeded')
      } else {
        console.error('Analysis failed:', error.message)
      }
    }
    throw error
  }
}
