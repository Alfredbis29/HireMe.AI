# Resume Analysis API Documentation

## Overview

The Resume Analysis API provides AI-powered analysis of resumes using OpenAI's GPT-4 model. It returns structured feedback including strengths, weaknesses, suggestions, and job matching recommendations.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### POST /api/analyzeResume

Analyzes a resume and returns comprehensive feedback including scoring, strengths, weaknesses, and job recommendations.

#### Real-World Example: Entry-Level Developer

**Request:**
```bash
curl -X POST http://localhost:3000/api/analyzeResume \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Jane Smith\nJunior Web Developer\n\nEducation:\n- Bachelor of Science in Computer Science, State University (2023)\n\nSkills:\n- JavaScript, React, HTML/CSS, Node.js, SQL, Git\n\nExperience:\n- Web Development Bootcamp Project: E-commerce Platform (3 months)\n  - Built responsive React frontend for product catalog\n  - Implemented shopping cart with state management\n- Freelance Web Developer (3 months)\n  - Created 2 client websites using React and Tailwind CSS",
    "jobTitle": "Junior Software Engineer",
    "industry": "Technology"
  }'
```

**Response:**
```json
{
  "overallScore": 72,
  "strengths": [
    "Solid technical foundation with modern tech stack",
    "Practical project experience demonstrated",
    "Git and version control knowledge"
  ],
  "weaknesses": [
    "Limited professional work experience",
    "No mention of testing or CI/CD practices",
    "Missing professional certifications or contributions"
  ]
}
```

#### Request Body

```typescript
{
  resumeText: string        // Required: The resume text to analyze
  jobTitle?: string        // Optional: Target job title for analysis
  industry?: string       // Optional: Target industry for analysis
}
```

#### Example Request

```javascript
const response = await fetch('/api/analyzeResume', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    resumeText: `
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
    `,
    jobTitle: 'Senior Software Engineer',
    industry: 'Technology'
  })
})

const analysis = await response.json()
```

#### Response Structure

```typescript
{
  overallScore: number                    // Overall resume score (0-100)
  strengths: string[]                      // Array of identified strengths
  weaknesses: string[]                    // Array of areas for improvement
  suggestions: string[]                   // General improvement suggestions
  skills: string[]                        // Extracted skills from resume
  experience: {
    years: number                         // Years of experience
    level: 'entry' | 'mid' | 'senior' | 'executive'
    summary: string                       // Experience summary
  }
  education: {
    degree: string                        // Degree type
    field: string                        // Field of study
    institution?: string                 // Institution name
  }
  jobMatches: Array<{
    title: string                         // Job title
    company: string                      // Company type
    matchScore: number                   // Match percentage (0-100)
    description: string                  // Job description
    requirements: string[]               // Job requirements
  }>
  keywords: string[]                      // Important keywords
  atsScore: number                       // ATS optimization score (0-100)
  recommendations: {
    immediate: string[]                  // Immediate action items
    longTerm: string[]                   // Long-term goals
    skills: string[]                     // Skills to develop
  }
  metadata: {
    analyzedAt: string                   // Analysis timestamp
    model: string                        // AI model used
    version: string                      // API version
  }
}
```

#### Example Response

```json
{
  "overallScore": 78,
  "strengths": [
    "Strong technical background in software development",
    "Relevant work experience in the field",
    "Good educational qualifications"
  ],
  "weaknesses": [
    "Limited leadership experience mentioned",
    "Could benefit from more quantified achievements"
  ],
  "suggestions": [
    "Add quantified achievements with specific numbers",
    "Include more action verbs in job descriptions"
  ],
  "skills": ["JavaScript", "React", "Node.js", "Python", "SQL"],
  "experience": {
    "years": 3,
    "level": "mid",
    "summary": "Software development experience with web technologies"
  },
  "education": {
    "degree": "Bachelor",
    "field": "Computer Science",
    "institution": "University of Technology"
  },
  "jobMatches": [
    {
      "title": "Senior Software Engineer",
      "company": "TechCorp Inc.",
      "matchScore": 92,
      "description": "Full-stack development role with React and Node.js",
      "requirements": ["JavaScript", "React", "Node.js", "Leadership"]
    }
  ],
  "keywords": ["JavaScript", "React", "Node.js", "Python", "SQL"],
  "atsScore": 75,
  "recommendations": {
    "immediate": [
      "Add quantified achievements with specific numbers",
      "Include more action verbs in job descriptions"
    ],
    "longTerm": [
      "Develop leadership skills",
      "Get relevant certifications"
    ],
    "skills": ["TypeScript", "AWS", "Docker"]
  },
  "metadata": {
    "analyzedAt": "2024-01-15T10:30:00.000Z",
    "model": "gpt-4",
    "version": "1.0"
  }
}
```

### GET /api/health

Health check endpoint to verify API availability.

#### Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "openai": "configured",
    "database": "not_required",
    "storage": "not_required"
  },
  "version": "1.0.0"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Resume text is required"
}
```

### 401 Unauthorized
```json
{
  "error": "OpenAI API key is invalid or missing"
}
```

### 429 Too Many Requests
```json
{
  "error": "OpenAI API quota exceeded"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to analyze resume",
  "details": "Specific error message (development only)"
}
```

## Usage Examples

### Using the API Client

```typescript
import { analyzeResume } from '@/lib/api'

// Basic analysis
const analysis = await analyzeResume('Your resume text here...')

// Targeted analysis
const targetedAnalysis = await analyzeResume(
  'Your resume text...',
  'Software Engineer',
  'Technology'
)
```

### Using the React Hook

```typescript
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis'

function MyComponent() {
  const { analysis, loading, error, analyzeResumeText } = useResumeAnalysis()
  
  const handleAnalyze = async () => {
    await analyzeResumeText('Your resume text...')
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
```

### Using Axios Directly

```typescript
import axios from 'axios'

const response = await axios.post('/api/analyzeResume', {
  resumeText: 'Your resume text...',
  jobTitle: 'Software Engineer',
  industry: 'Technology'
})

const analysis = response.data
```

## Rate Limits

- No built-in rate limiting
- Limited by OpenAI API quotas
- Recommended: Implement client-side rate limiting for production

## Authentication

- No authentication required for development
- OpenAI API key must be configured in environment variables
- For production, consider adding API key authentication

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

Visit `/test-api` to test the API functionality with a web interface.

## Support

For issues or questions, please check the console logs or contact the development team.
