# 🗄️ MongoDB Setup Guide for HireMe.AI

## 📋 Setting up MongoDB Database for Production

To fix the "can not create the user" issue, you need to set up a MongoDB database for production deployment.

### 🚀 **Quick Setup (MongoDB Atlas - Free)**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier available)

2. **Configure Database Access**
   - Go to **Database Access** → **Add New Database User**
   - Create a user with read/write permissions
   - Note down the username and password

3. **Get Connection String**
   - Go to **Clusters** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `hireme-ai`

4. **Set Environment Variable**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hireme-ai?retryWrites=true&w=majority
   ```

### 🔧 **Alternative: Local MongoDB**

For development, you can use a local MongoDB:

1. **Install MongoDB locally**
   ```bash
   # Ubuntu/Debian
   sudo apt install mongodb
   
   # macOS
   brew install mongodb-community
   ```

2. **Start MongoDB service**
   ```bash
   sudo systemctl start mongodb
   ```

3. **Set Environment Variable**
   ```env
   MONGODB_URI=mongodb://localhost:27017/hireme-ai
   ```

### 🌐 **Production Deployment**

#### **Vercel Deployment:**
1. Go to your Vercel project settings
2. Add environment variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string

#### **Netlify Deployment:**
1. Go to Site Settings → Environment Variables
2. Add `MONGODB_URI` with your connection string

#### **Railway Deployment:**
1. Go to your project → Variables
2. Add `MONGODB_URI` with your connection string

### 🧪 **Testing the Setup**

1. **Start your application**
   ```bash
   npm run dev
   ```

2. **Try to create a user account**
   - Go to `/signup`
   - Fill out the registration form
   - Submit the form

3. **Check if user was created**
   - Check your MongoDB Atlas dashboard
   - Look for the `hireme-ai` database
   - Check the `users` collection

### 🔍 **Troubleshooting**

#### **"Cannot create user" Error:**
- ✅ **Check MONGODB_URI** is set correctly
- ✅ **Verify MongoDB connection** in logs
- ✅ **Check database permissions**

#### **Connection Issues:**
- ✅ **Whitelist IP addresses** in MongoDB Atlas
- ✅ **Check firewall settings**
- ✅ **Verify connection string format**

### 📊 **Database Schema**

The application will automatically create:
- **Database**: `hireme-ai`
- **Collection**: `users`
- **Fields**: `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`

### 🎯 **Expected Result**

Once MongoDB is set up:
- ✅ **Users can register** successfully
- ✅ **Users can sign in** with email/password
- ✅ **Google OAuth** works (if configured)
- ✅ **Data persists** between deployments
- ✅ **No more "can not create user" errors**

### 🚀 **Ready for Production**

Your HireMe.AI application will now:
- **Store users in MongoDB** instead of local files
- **Work in production** deployments
- **Persist user data** across deployments
- **Support both email/password and Google OAuth**

**The "can not create user" issue will be resolved!** 🎉
