# 🛡️ Autonomous Program Charter

A beautiful, modern React application for AI-powered project charter generation with multi-agent risk analysis.

## ✨ Features

- **Modern Dark UI** - Replit-inspired design with smooth animations
- **Beautiful Icons** - Lucide React icon library
- **Real AI Integration** - Connects to Google Gemini API
- **Three AI Agents** - Sceptic, Historian, and Mediator analysis
- **Professional Output** - Formal project charter generation
- **Full Stack** - React frontend + Node.js backend

## 🚀 Quick Start

### One-Command Start (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

This will:
1. Install all dependencies (frontend + backend)
2. Start the backend server on port 5000
3. Start the React app on port 3000
4. Open your browser automatically

### Manual Start

If you prefer to run frontend and backend separately:

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
npm install
npm start
```

## 📋 Prerequisites

- Node.js 16+ installed
- npm package manager
- Google API Key ([Get one here](https://makersuite.google.com/app/apikey))

## 🎯 How to Use

1. **Start the app** using `start.bat` (Windows) or `start.sh` (Mac/Linux)
2. **Enter your Google API Key** in the configuration section
3. **Select a model** (gemini-1.5-pro recommended)
4. **Describe your project** in the text area
5. **Click "Generate Charter"** and wait for AI analysis
6. **Review results** from three AI agents
7. **Get your charter** - formal project document

## 🏗️ Architecture

```
autonomous-charter/
├── src/                    # React frontend
│   ├── App.js             # Main component
│   ├── App.css            # Styles
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── server/                 # Node.js backend
│   ├── server.js          # Express API
│   └── package.json       # Backend dependencies
├── public/                 # Static files
│   └── index.html         # HTML template
├── docs/                   # Documentation
├── package.json           # Frontend dependencies
├── start.bat              # Windows launcher
└── start.sh               # Mac/Linux launcher
```

## 🎨 UI Highlights

- **Dark Theme** - Professional #0e1525 background
- **Purple Gradient Header** - Eye-catching gradient
- **Card-based Layout** - Clean, organized sections
- **Smooth Animations** - Hover effects and transitions
- **Loading States** - Spinner during processing
- **Error Handling** - Clear error messages
- **Responsive Design** - Works on all screen sizes

## 🔧 API Endpoints

### POST /api/generate-charter
Generate a project charter using AI agents.

**Request:**
```json
{
  "apiKey": "your-google-api-key",
  "model": "gemini-1.5-pro",
  "projectGoal": "Your project description..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sceptic": "Risk analysis...",
    "historian": "Historical context...",
    "mediator": "Balanced recommendation...",
    "charter": "Formal charter document..."
  }
}
```

### GET /api/health
Health check endpoint.

## 🛠️ Development

### Frontend Development
```bash
npm start
```
Runs on http://localhost:3000 with hot reload.

### Backend Development
```bash
cd server
npm run dev
```
Runs on http://localhost:5000 with nodemon.

## 📦 Build for Production

### Frontend
```bash
npm run build
```
Creates optimized build in `build/` folder.

### Backend
The backend runs as-is in production. Set environment variables:
```bash
PORT=5000 node server/server.js
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `build/` folder
3. Set environment variable for API URL

### Backend (Heroku/Railway)
1. Deploy the `server/` folder
2. Set PORT environment variable
3. Update frontend API URL

### Full Stack (Single Server)
Serve React build from Express:
```javascript
app.use(express.static(path.join(__dirname, '../build')));
```

## 🔐 Security Notes

- Never commit API keys
- Use environment variables in production
- Implement rate limiting for API endpoints
- Add authentication for production use

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**CORS errors:**
- Make sure backend is running on port 5000
- Check CORS is enabled in server.js

**API key errors:**
- Verify your Google API key is valid
- Check you have Gemini API access enabled

## 📝 License

Educational/Research Use

## 🤝 Contributing

This is a capstone project. Feedback welcome!

---

**Built with React, Node.js, Express, Google Gemini AI, and ❤️**
