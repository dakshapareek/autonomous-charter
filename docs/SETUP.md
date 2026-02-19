# 🚀 Complete Setup Guide

## Prerequisites Installation

### 1. Install Node.js

**Windows:**
1. Download from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Check "Add to PATH" during installation
4. Restart your terminal
5. Verify: `node --version` and `npm --version`

**Mac:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

## 🎯 Quick Start (After Node.js is installed)

### Windows
```bash
start.bat
```

### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

## 📋 Manual Setup (If automatic script fails)

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Step 3: Start Backend (Terminal 1)
```bash
cd server
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
📡 API endpoint: http://localhost:5000/api/generate-charter
```

### Step 4: Start Frontend (Terminal 2)
```bash
npm start
```

Your browser will automatically open to http://localhost:3000

## ✅ Verify Installation

1. **Backend is running**: Visit http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Frontend is running**: Visit http://localhost:3000
   - Should see the Autonomous Program Charter interface

## 🔑 Get Your Google API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it in the app's Configuration section

## 🎨 Using the App

1. **Configure**:
   - Enter your Google API Key
   - Select a model (gemini-1.5-pro recommended)

2. **Input**:
   - Describe your project goal
   - Include timeline, team size, constraints

3. **Generate**:
   - Click "Generate Charter"
   - Wait 10-30 seconds for AI analysis

4. **Review**:
   - See analysis from three AI agents
   - Get your formal project charter

## 🐛 Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Port 3000 or 5000 already in use
**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### CORS errors
- Make sure backend is running on port 5000
- Check both terminals are running
- Restart both frontend and backend

### API key errors
- Verify your Google API key is valid
- Check you have Gemini API access enabled
- Try generating a new API key

### Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 📦 What Gets Installed

### Frontend Dependencies
- **react** - UI library
- **react-dom** - React rendering
- **react-scripts** - Build tools
- **lucide-react** - Beautiful icons
- **axios** - HTTP client

### Backend Dependencies
- **express** - Web server
- **cors** - Cross-origin requests
- **@google/generative-ai** - Gemini AI SDK
- **dotenv** - Environment variables
- **nodemon** - Auto-restart (dev)

## 🎯 Next Steps

Once everything is running:

1. Test with a sample project goal
2. Review the AI agent analysis
3. Examine the generated charter
4. Try different project scenarios
5. Experiment with different models

## 💡 Tips

- **Use gemini-1.5-pro** for best results
- **Be specific** in your project descriptions
- **Include constraints** (timeline, team, budget)
- **Mention dependencies** and technical requirements
- **Save your API key** securely (don't commit to git)

## 🚀 Ready to Go!

After following these steps, you should have:
- ✅ Node.js and npm installed
- ✅ All dependencies installed
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Google API key configured
- ✅ Beautiful UI ready to use

**Enjoy your AI-powered project charter generator!** 🎉
