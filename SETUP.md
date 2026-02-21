# HireMe.AI - Environment Setup Instructions

## Quick Setup (Demo Mode)
The app is currently running in demo mode with mock data. No additional setup is required to test the basic functionality.

## Full Setup (With Real AI Analysis)

To enable real AI-powered resume analysis, create a `.env.local` file in the project root with the following minimal environment variables:

```bash
# === REQUIRED VARIABLES ===

# MongoDB Configuration (Required for user data persistence)
MONGODB_URI=mongodb://localhost:27017/hireme_ai

# NextAuth Configuration (Required for authentication)
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# === OPTIONAL VARIABLES ===

# OpenAI Configuration (Optional - enables AI resume analysis)
OPENAI_API_KEY=your_actual_openai_api_key_here

# Google OAuth (Optional - enables Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn Integration (Optional - for job search features)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

### Environment Variable Guide

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `MONGODB_URI` | ✅ | Database connection string | `mongodb://localhost:27017/hireme_ai` |
| `NEXTAUTH_SECRET` | ✅ | Session encryption key | Generated via `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Authentication callback URL | `http://localhost:3000` |
| `OPENAI_API_KEY` | ❌ | AI analysis capability | From https://platform.openai.com |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth login | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth secret | From Google Cloud Console |

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
