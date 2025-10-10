#!/bin/bash

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# OpenAI API Key for AI analysis
OPENAI_API_KEY=your_openai_api_key_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    echo "✅ .env.local file created!"
    echo "⚠️  Please update OPENAI_API_KEY with your actual OpenAI API key"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🚀 Setup complete! Run 'npm install' to install dependencies"
echo "📝 Don't forget to add your OpenAI API key to .env.local"
