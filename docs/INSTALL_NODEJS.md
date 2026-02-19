# ⚠️ Node.js Required

## You Need to Install Node.js First!

The app cannot run without Node.js and npm installed on your system.

## 📥 Download & Install Node.js

### Windows (Your System)

1. **Download Node.js**
   - Go to: https://nodejs.org/
   - Click the big green button that says "Download Node.js (LTS)"
   - This will download the installer (about 30MB)

2. **Run the Installer**
   - Double-click the downloaded file
   - Click "Next" through the installation wizard
   - **IMPORTANT**: Make sure "Add to PATH" is checked
   - Click "Install"
   - Wait for installation to complete (2-3 minutes)

3. **Restart Your Terminal**
   - Close all PowerShell/Command Prompt windows
   - Open a new terminal

4. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers like:
   ```
   v20.x.x
   10.x.x
   ```

## 🚀 After Installing Node.js

Once Node.js is installed, run:

**Windows:**
```bash
start.bat
```

This will:
1. Install all dependencies automatically
2. Start the backend server (port 5000)
3. Start the React app (port 3000)
4. Open your browser automatically

## 🎯 Alternative: Manual Start

If the automatic script doesn't work:

**Terminal 1 - Install & Start Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Install & Start Frontend:**
```bash
npm install
npm start
```

## ✅ What You'll See

When everything is running:
- Backend: `🚀 Server running on http://localhost:5000`
- Frontend: Browser opens to `http://localhost:3000`
- Beautiful dark UI with purple gradient header

## 🔑 Don't Forget Your API Key!

You'll also need a Google API Key:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste it in the app's Configuration section

## 💡 Quick Summary

1. ✅ Install Node.js from https://nodejs.org/
2. ✅ Restart your terminal
3. ✅ Run `start.bat`
4. ✅ Get Google API key
5. ✅ Use the app!

---

**Need help? Check docs/SETUP.md for detailed instructions**
