# 🔗 LinkedIn API Setup Guide for HireMe.AI

## 📋 Setting up LinkedIn Job Search Integration

To enable real LinkedIn job search for your HireMe.AI application, follow these steps:

### 1. Create LinkedIn App

1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Sign in with your LinkedIn account
3. Click **"Create App"**
4. Fill in the required information:
   - **App name**: HireMe.AI
   - **LinkedIn Page**: Your company LinkedIn page
   - **Privacy Policy URL**: Your privacy policy URL
   - **App Logo**: Upload your app logo

### 2. Configure App Settings

1. **Products**: Request access to:
   - **Sign In with LinkedIn using OpenID Connect**
   - **Share on LinkedIn**
   - **Marketing Developer Platform** (for job search)

2. **Auth**: Configure OAuth 2.0 settings:
   - **Authorized Redirect URLs**: 
     - `http://localhost:3000/api/auth/callback/linkedin` (development)
     - `https://yourdomain.com/api/auth/callback/linkedin` (production)

### 3. Get API Credentials

1. Go to **Auth** tab in your app settings
2. Copy your **Client ID** and **Client Secret**
3. Note your **App ID** for API calls

### 4. Request Job Search API Access

1. Go to **Products** tab
2. Request access to **Marketing Developer Platform**
3. Fill out the application form:
   - **Use case**: Job search and career matching
   - **Data usage**: Display job listings to users
   - **Compliance**: Confirm data protection compliance

### 5. Environment Variables

Add these to your `.env.local` file:

```env
# LinkedIn API Configuration
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token_here

# Existing variables
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 6. Generate Access Token

#### Option A: Using LinkedIn API Explorer
1. Go to [LinkedIn API Explorer](https://developer.linkedin.com/tools/api-explorer)
2. Select your app
3. Choose **"Job Search"** endpoint
4. Generate access token
5. Copy the token to your environment variables

#### Option B: Programmatic Token Generation
```javascript
// This would be implemented in your backend
const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  })
})
```

### 7. API Endpoints

The job search API will use these LinkedIn endpoints:

- **Job Search**: `https://api.linkedin.com/v2/jobSearch`
- **Job Details**: `https://api.linkedin.com/v2/jobs/{jobId}`
- **Company Info**: `https://api.linkedin.com/v2/companies/{companyId}`

### 8. Rate Limits

LinkedIn API has rate limits:
- **Job Search**: 100 requests per day
- **Job Details**: 500 requests per day
- **Company Info**: 200 requests per day

### 9. Data Privacy

Ensure compliance with:
- **GDPR** - European data protection
- **CCPA** - California privacy laws
- **LinkedIn Terms** - Platform terms of service

### 10. Testing

Test your integration:

```bash
# Test job search API
curl -X POST http://localhost:3000/api/jobs/search \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["JavaScript", "React"],
    "experience": 3,
    "location": "San Francisco",
    "jobTitle": "Software Engineer"
  }'
```

## 🔧 Implementation Notes

### Current Implementation
- **Primary**: LinkedIn Job Search API
- **Fallback**: Mock job data
- **Error Handling**: Graceful degradation
- **Caching**: Consider implementing Redis for job caching

### Features
- **Real-time job search** from LinkedIn
- **Skill-based matching** with user profile
- **Experience level filtering**
- **Location-based search**
- **Direct application links**

### Security
- **API Key Protection** - Never expose in client-side code
- **Rate Limiting** - Implement request throttling
- **Data Validation** - Sanitize all inputs
- **Error Handling** - Don't expose sensitive information

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
- **Vercel**: Add in project settings
- **Railway**: Add in environment variables
- **Netlify**: Add in site settings

### Monitoring
- **API Usage** - Monitor LinkedIn API calls
- **Error Rates** - Track failed requests
- **Performance** - Measure response times
- **User Experience** - Monitor job search success

## 📚 Additional Resources

- [LinkedIn API Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [Job Search API Reference](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/job-search-api)
- [OAuth 2.0 Guide](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- [Rate Limits](https://docs.microsoft.com/en-us/linkedin/shared/authentication/rate-limits)

## 🎯 Ready for Production

Once configured, your HireMe.AI application will:
- **Fetch real LinkedIn jobs** based on user skills
- **Provide direct application links** to LinkedIn job postings
- **Show current job opportunities** with real data
- **Fallback gracefully** if LinkedIn API is unavailable

**Your job search will now show actual current positions from LinkedIn!** 🚀✨
