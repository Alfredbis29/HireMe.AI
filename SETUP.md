# HireMe.AI - Environment Setup Instructions

## Quick Setup (Demo Mode)
The app is currently running in demo mode with mock data. No additional setup is required to test the basic functionality.

## Full Setup (With Real AI Analysis)

To enable real AI-powered resume analysis, create a `.env.local` file in the project root with:

```bash
# OpenAI Configuration (Required for real AI analysis)
OPENAI_API_KEY=your_actual_openai_api_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Google OAuth (Optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## How to Get OpenAI API Key

1. Visit https://platform.openai.com/
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

## Current Status

✅ **Working Features (Demo Mode):**
- User registration and sign-in
- Resume upload and analysis (mock data)
- LinkedIn job search integration
- Complete user flow from analysis to job applications

✅ **Ready for Production:**
- All components are built and functional
- Mock data provides realistic demo experience
- Easy to switch to real AI analysis with API key

## Testing the App

1. Visit http://localhost:3001
2. Try the resume analysis on the homepage (no account needed)
3. Sign up for an account
4. Upload a resume after signing in
5. See the LinkedIn job recommendations
6. Click "Apply on LinkedIn" to test the job application flow

The app is fully functional in demo mode!
