# Google OAuth Setup Guide for HireMe.AI

## 🔐 Setting up Google Authentication

To enable Google sign-in for your HireMe.AI application, follow these steps:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: HireMe.AI
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (for development)

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 4. Environment Variables

Create or update your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OpenAI (existing)
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Generate NextAuth Secret

Generate a random secret for NextAuth:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6. Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Update the redirect URI in Google Cloud Console
2. Set environment variables in your deployment platform
3. Update `NEXTAUTH_URL` to your production domain

## 🧪 Testing

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/login`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Verify you're redirected back to the home page

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that the redirect URI in Google Console matches your app URL
   - Ensure the callback URL is exactly: `/api/auth/callback/google`

2. **"OAuth consent screen not configured"**
   - Complete the OAuth consent screen setup
   - Add your email as a test user for development

3. **"Invalid client ID"**
   - Double-check your `GOOGLE_CLIENT_ID` in `.env.local`
   - Ensure the client ID is from the correct Google Cloud project

4. **"NextAuth secret not set"**
   - Generate and set the `NEXTAUTH_SECRET` environment variable

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## 🚀 Ready to Go!

Once configured, users will be able to:
- Sign in with their Google account
- Access personalized features
- Save their resume analysis history
- Get tailored job recommendations

Your HireMe.AI application will have secure, professional authentication! 🎉
