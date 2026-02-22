#!/bin/bash

# Live Chat Setup Script
# Automatically sets up both frontend and backend for live chat

set -e

echo "🚀 Starting Live Chat Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✓ Node.js and Python 3 detected"

# Install Next.js dependencies
echo ""
echo "📦 Installing Next.js dependencies..."
npm install socket.io-client

# Setup Python backend
echo ""
echo "🐍 Setting up Python chat server..."
cd python-chat-server

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
fi

echo ""
echo "✅ Live chat setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit python-chat-server/.env with your settings"
echo "2. Start Python backend: cd python-chat-server && source venv/bin/activate && python3 app.py"
echo "3. Import ChatWindow component in your Next.js app"
echo "4. See CHAT_INTEGRATION.md for detailed guide"
echo ""
echo "🎉 Ready to use live chat!"
