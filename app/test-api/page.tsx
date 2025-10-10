import ResumeAnalyzer from '@/components/ResumeAnalyzer'

export default function TestAPIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Analysis API Test
          </h1>
          <p className="text-xl text-gray-600">
            Test the AI-powered resume analysis functionality
          </p>
        </div>
        <ResumeAnalyzer />
      </div>
    </div>
  )
}
