# HireMe.AI - AI-Powered Career Assistant

A modern Next.js application that uses AI to analyze resumes and provide career insights, job recommendations, and optimization suggestions.

## Features

- 🤖 **AI-Powered Resume Analysis** - Get comprehensive analysis of your resume
- 📊 **Scoring & Insights** - Receive detailed scores and improvement suggestions
- 🎯 **Job Matching** - Find relevant job opportunities based on your profile
- 📈 **Career Optimization** - Get specific recommendations to improve your resume
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS and shadcn/ui
- ⚡ **Fast & Secure** - Built with Next.js 14 and TypeScript

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4 (configurable)
- **File Handling**: Support for PDF and Word documents

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hireme-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
hireme-ai/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── analyze-resume/ # Resume analysis endpoint
│   ├── upload/            # Upload page
│   ├── results/           # Results page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Pages

- **Home (`/`)** - Landing page with features and call-to-action
- **Upload (`/upload`)** - Resume upload with drag-and-drop functionality
- **Results (`/results`)** - AI analysis results with recommendations

## API Endpoints

- **POST `/api/analyze-resume`** - Analyzes uploaded resume files

## Features in Detail

### Resume Analysis
- Overall scoring (0-100)
- Strengths and weaknesses identification
- Specific improvement recommendations
- Skills extraction and categorization

### Job Matching
- AI-powered job recommendations
- Match scoring based on profile
- Company and role suggestions

### Career Insights
- Market trend analysis
- Salary expectations
- Career path recommendations

## Customization

### Adding New Analysis Features
1. Modify the API route in `app/api/analyze-resume/route.ts`
2. Update the analysis interface in `app/results/page.tsx`
3. Add new UI components as needed

### Styling
- Uses Tailwind CSS for styling
- shadcn/ui components for consistent design
- Customizable color scheme in `tailwind.config.js`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting platform

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI analysis | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@hireme-ai.com or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and AI