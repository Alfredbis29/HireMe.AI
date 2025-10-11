'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useResumeAnalysis } from '@/hooks/useResumeAnalysis'
import { Brain, CheckCircle, AlertCircle, Target, TrendingUp } from 'lucide-react'

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [industry, setIndustry] = useState('')
  
  const { analysis, loading, error, analyzeResumeText, clearAnalysis } = useResumeAnalysis()

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      alert('Please enter resume text')
      return
    }
    
    await analyzeResumeText(resumeText, jobTitle || undefined, industry || undefined)
  }

  const handleClear = () => {
    setResumeText('')
    setJobTitle('')
    setIndustry('')
    clearAnalysis()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Resume Analysis
          </CardTitle>
          <CardDescription>
            Enter your resume text and get AI-powered analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobTitle">Target Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry (Optional)</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="resumeText">Resume Text</Label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !resumeText.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing your resume with AI...</span>
                <span>Processing</span>
              </div>
              <Progress value={undefined} className="w-full" />
            </div>
          )}

          {error && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Overall Score: {analysis.overallScore}/100
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={analysis.overallScore} className="h-4 mb-4" />
              <p className="text-sm text-gray-600">
                ATS Score: {analysis.atsScore}/100
              </p>
            </CardContent>
          </Card>

          {/* Strengths and Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <Target className="mr-2 h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-4 w-4 bg-orange-100 rounded-full mt-1 mr-2 flex-shrink-0 flex items-center justify-center">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Immediate Actions</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Long-term Goals</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600">• {rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Skills to Develop</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.skills.map((skill, index) => (
                      <li key={index} className="text-sm text-gray-600">• {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Matches */}
          {analysis.jobMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Job Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.jobMatches.map((job, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {job.matchScore}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.matchScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
