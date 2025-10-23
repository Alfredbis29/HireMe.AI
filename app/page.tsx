import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UserProfile from '@/components/UserProfile'
import ResumeAnalyzer from '@/components/ResumeAnalyzer'
import { ArrowRight, Brain, FileText, Target, Users, Zap, Lock, Upload } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">HireMe.AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <UserProfile />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Career with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}AI-Powered Insights
            </span>
          </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Create your free account to access AI-powered resume analysis, personalized job recommendations, 
                and career optimization suggestions to land your dream job.
              </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold"
                data-signin="true"
                style={{ 
                  display: 'inline-flex',
                  visibility: 'visible',
                  opacity: '1',
                  pointerEvents: 'auto'
                }}
              >
                Sign In
              </Button>
            </Link>
          </div>
              <p className="text-sm text-gray-500 mb-8">
                ✨ Create your free account to unlock AI-powered career insights!
              </p>
        </div>
      </section>

          {/* Authentication Required Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get Started with AI Resume Analysis
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Create your free account to access our AI-powered resume analysis, 
                  personalized job recommendations, and career optimization insights.
                </p>
              </div>
              
              {/* Authentication Required Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🔒 Authentication Required
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  To protect your data and provide personalized analysis, 
                  you need to create a free account first.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 mb-3">What you'll get:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        AI-powered resume analysis
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Personalized job recommendations
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Career optimization insights
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Secure data storage
                      </li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 mb-3">Why authentication?</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <Lock className="h-4 w-4 text-blue-500 mr-2" />
                        Protect your personal data
                      </li>
                      <li className="flex items-center">
                        <Lock className="h-4 w-4 text-blue-500 mr-2" />
                        Save your analysis results
                      </li>
                      <li className="flex items-center">
                        <Lock className="h-4 w-4 text-blue-500 mr-2" />
                        Track your progress
                      </li>
                      <li className="flex items-center">
                        <Lock className="h-4 w-4 text-blue-500 mr-2" />
                        Personalized recommendations
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                      <Brain className="mr-2 h-5 w-5" />
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full sm:w-auto text-lg px-8 py-6"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Already have an account? Sign In
                    </Button>
                  </Link>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  ✨ It only takes 30 seconds to create your account and start optimizing your career!
                </p>
              </div>
            </div>
          </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose HireMe.AI?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform analyzes your resume and provides actionable insights 
            to help you stand out in the job market.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced AI analyzes your resume for strengths, weaknesses, and optimization opportunities.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Job Matching</CardTitle>
              <CardDescription>
                Get personalized job recommendations based on your skills and experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Resume Optimization</CardTitle>
              <CardDescription>
                Receive specific suggestions to improve your resume format and content.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Instant Results</CardTitle>
              <CardDescription>
                Get comprehensive analysis and recommendations in seconds, not hours.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Career Insights</CardTitle>
              <CardDescription>
                Understand market trends and salary expectations for your role.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                Get tailored advice on skills to develop and career paths to explore.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your resume data is protected with secure authentication and privacy controls.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Want More Features?
          </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have already optimized their careers with AI. 
                Create your free account to access all features and start your career transformation today.
              </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold"
                data-signin="true"
                style={{ 
                  display: 'inline-flex',
                  visibility: 'visible',
                  opacity: '1',
                  pointerEvents: 'auto'
                }}
              >
                Sign In
              </Button>
            </Link>
          </div>
              <p className="text-sm text-blue-100 mt-6">
                💡 Ready to transform your career? Create your free account now!
              </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">HireMe.AI</span>
          </div>
          <p className="text-center text-gray-400">
            © 2025 HireMe.AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
