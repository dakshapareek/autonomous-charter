# ⚠️ Restart Your Terminal!

## Node.js is installed, but your terminal needs to be restarted

After installing Node.js, you must **close and reopen** your terminal for the changes to take effect.

## 🔄 Steps to Restart:

### Option 1: Close and Reopen
1. Close this PowerShell/Command Prompt window completely
2. Open a new PowerShell/Command Prompt
3. Navigate back to the project folder:
   ```bash
   cd C:\Users\daksh\OneDrive\Desktop\autonomous-charter
   ```
4. Run the app:
   ```bash
   start.bat
   ```

### Option 2: Refresh Environment (Advanced)
In the current terminal, run:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then verify:
```bash
node --version
npm --version
```

## ✅ Verify Node.js is Working

After restarting, run:
```bash
node --version
```

You should see something like: `v20.11.0`

If you see a version number, Node.js is ready!

## 🚀 Then Start the App

```bash
start.bat
```

---

**TL;DR: Close this window, open a new terminal, run `start.bat`**
