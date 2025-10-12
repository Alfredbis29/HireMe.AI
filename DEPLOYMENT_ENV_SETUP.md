# 🔧 Remote Deployment Environment Setup

## Required Environment Variables

For authentication to work on remote deployment, you need to set these environment variables in your Vercel dashboard:

### 🔐 **Authentication (Required)**
```bash
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

### 🔑 **Google OAuth (Optional but Recommended)**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 🤖 **OpenAI API (Optional)**
```bash
OPENAI_API_KEY=your-openai-api-key
```

### 🗄️ **Database (Optional - for production)**
```bash
MONGODB_URI=your-mongodb-connection-string
```

## 🚀 **How to Set Environment Variables in Vercel**

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each variable with the correct value**

## 🔧 **Step-by-Step Setup**

### 1. **NEXTAUTH_URL**
- Set to your deployed app URL: `https://your-app-name.vercel.app`
- This is **CRITICAL** for authentication to work

### 2. **NEXTAUTH_SECRET**
- Generate a random secret key
- You can use: `openssl rand -base64 32`
- Or use an online generator

### 3. **Google OAuth (Optional)**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create OAuth 2.0 credentials
- Add your domain to authorized origins

### 4. **Database (Optional)**
- The app works with local JSON database by default
- For production, consider MongoDB Atlas

## 🐛 **Common Issues**

### Issue 1: "Invalid redirect URI"
- **Solution**: Make sure `NEXTAUTH_URL` matches your deployed URL exactly
- **Check**: No trailing slash, correct protocol (https)

### Issue 2: "Database connection failed"
- **Solution**: The app uses local JSON database by default
- **Alternative**: Set up MongoDB Atlas and add `MONGODB_URI`

### Issue 3: "Session not persisting"
- **Solution**: Check that `NEXTAUTH_SECRET` is set
- **Verify**: Environment variables are deployed (not just local)

## 🔍 **Testing Authentication**

1. **Deploy with environment variables**
2. **Try to create an account**
3. **Try to sign in**
4. **Check browser console for errors**

## 📋 **Minimum Required Variables**

For basic authentication to work, you need at least:
```bash
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
```

## 🆘 **If Still Not Working**

1. **Check Vercel logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test locally** with the same environment variables
4. **Check browser console** for client-side errors
