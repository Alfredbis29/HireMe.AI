#!/bin/bash

echo "🚀 Setting up HireMe.AI project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# OpenAI API Key for AI analysis
OPENAI_API_KEY=your_openai_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ .env.local file created"
    echo "⚠️  Please update OPENAI_API_KEY with your actual OpenAI API key"
else
    echo "✅ .env.local file already exists"
fi

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env.local; then
    echo "⚠️  Remember to set your OpenAI API key in .env.local"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add your OpenAI API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your app"
echo "4. Visit http://localhost:3000/test-api to test the API"
echo ""
echo "📚 Documentation:"
echo "- API Documentation: API_DOCUMENTATION.md"
echo "- README: README.md"
echo ""
echo "🔧 Available commands:"
echo "- npm run dev     # Start development server"
echo "- npm run build   # Build for production"
echo "- npm run start   # Start production server"
echo "- npm run lint    # Run ESLint"
