# 🚀 HireMe.AI - AI-Powered Career Assistant

<div align="center">

![HireMe.AI Logo](https://img.shields.io/badge/HireMe.AI-AI%20Powered-blue?style=for-the-badge&logo=openai)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

**Transform your career with AI-powered resume analysis and job matching**

[🛠 Setup Guide](#-getting-started) • [📚 Documentation](#-documentation) • [🔐 Authentication](#-authentication)

</div>

---

## ✨ Features

### 🔐 **Authentication System**
- **Email/Password Registration** - Traditional sign-up with secure password hashing
- **Google OAuth Integration** - One-click authentication with Google accounts
- **Secure Session Management** - JWT-based authentication with NextAuth.js
- **User Profile Management** - Personalized experience with user data

### 🤖 **AI-Powered Analysis**
- **OpenAI Integration** - Advanced resume analysis using OpenAI API
- **Comprehensive Scoring** - Overall resume quality assessment (0-100)
- **ATS Optimization** - Applicant Tracking System compatibility scoring
- **Skills Extraction** - Automatic identification of technical and soft skills

### 📊 **Detailed Insights**
- **Strengths & Weaknesses** - Identify what makes your resume stand out
- **Actionable Recommendations** - Specific suggestions for improvement
- **Job Matching** - AI-recommended job opportunities with match scores
- **Career Guidance** - Long-term development recommendations

### 🎨 **Modern UI/UX**
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Beautiful Gradients** - Professional color schemes and animations
- **Drag & Drop Upload** - Easy resume file upload with progress indicators
- **Interactive Components** - Smooth animations and real-time feedback

### 🔧 **Technical Excellence**
- **Next.js 14** - Latest React framework with App Router
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first styling with custom components
- **shadcn/ui** - Accessible, customizable component library

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Google OAuth Credentials** (Optional - for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alfredbis29/HireMe.AI.git
   cd HireMe.AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file and add the following:
   ```env
   # OpenAI API Key (Required)
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # NextAuth Configuration (Required)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # Google OAuth (Optional - for Google sign-in)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```
   
   **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📱 Pages & Features

### 🏠 **Home Page** (`/`)
- Beautiful landing page with feature showcase
- Call-to-action buttons for account creation
- Professional gradient design
- Responsive layout for all devices

### 🔐 **Authentication Pages**
- **Sign Up** (`/signup`) - Email/password registration and Google OAuth
- **Login** (`/login`) - Email/password login and Google OAuth
- Secure password hashing with bcryptjs
- Form validation and error handling

### 📤 **Upload Page** (`/upload`)
- **Authentication Required** - Must be logged in to access
- Drag-and-drop file upload interface
- Support for PDF, DOC, and DOCX files
- Real-time upload progress
- File validation and error handling

### 📊 **Results Page** (`/results`)
- **Authentication Required** - Must be logged in to access
- Comprehensive AI analysis results
- Interactive score visualization
- Job matching recommendations
- Personalized user experience

---

## 🔌 API Endpoints

### Authentication Endpoints
- **`POST /api/auth/register`** - User registration with email/password
- **`POST /api/auth/login`** - User login with credentials
- **`POST /api/auth/[...nextauth]`** - NextAuth.js authentication

### Resume Analysis Endpoints
- **`POST /api/upload-resume`** - File upload and analysis
- **`GET /api/health`** - Health check endpoint

### Example API Usage
```javascript
// Register a new user
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword'
  })
});

// Upload resume for analysis
const formData = new FormData();
formData.append('file', resumeFile);
const analysis = await fetch('/api/upload-resume', {
  method: 'POST',
  body: formData
});
```

---

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint

# Setup
./setup.sh           # Automated setup script
```

### Project Structure

```
hireme-ai/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── upload-resume/ # File upload and analysis
│   │   └── health/        # Health check
│   ├── signup/            # Registration page
│   ├── login/             # Login page
│   ├── upload/            # Upload page (protected)
│   ├── results/           # Results page (protected)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── providers/        # Context providers
│   └── UserProfile.tsx   # User profile component
├── lib/                  # Utility functions
│   └── db.ts            # User database functions
├── types/                # TypeScript interfaces
└── data/                 # User data storage (gitignored)
```

### Key Technologies

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3
- **Components**: shadcn/ui
- **Authentication**: NextAuth.js with JWT
- **Password Hashing**: bcryptjs
- **AI**: OpenAI API
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **File Upload**: React Dropzone

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔐 Authentication

### User Registration & Login
- **Email/Password**: Traditional authentication with secure password hashing
- **Google OAuth**: One-click authentication with Google accounts
- **Session Management**: JWT-based sessions with NextAuth.js
- **Password Security**: bcryptjs hashing with salt rounds

### Authentication Flow
1. **New Users**: Visit home → Sign up → Create account → Access features
2. **Returning Users**: Visit home → Sign in → Access features
3. **Protected Routes**: Upload and results pages require authentication

### Security Features
- **Password Hashing**: Secure bcryptjs implementation
- **Input Validation**: Email format and required field validation
- **Error Handling**: User-friendly error messages
- **Session Security**: Proper token management

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: See sections above for setup and usage
- **Issues**: [GitHub Issues](https://github.com/Alfredbis29/HireMe.AI/issues)
- **Authentication Setup**: See [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)
- **Authentication Flow**: See [Authentication Flow Guide](./AUTHENTICATION_FLOW.md)

---

## 🙏 Acknowledgments

- **OpenAI** for providing the AI API
- **NextAuth.js** for the authentication framework
- **Vercel** for the amazing Next.js framework
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for the beautiful component library

---

<div align="center">

**Made with ❤️ by the Alpha Team**

[⭐ Star this repo](https://github.com/Alfredbis29/HireMe.AI) • [🐛 Report Bug](https://github.com/Alfredbis29/HireMe.AI/issues) • [💡 Request Feature](https://github.com/Alfredbis29/HireMe.AI/issues)

</div>
