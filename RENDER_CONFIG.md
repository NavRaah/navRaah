# Render Backend Configuration

## ✅ Your Backend URL
```
https://navraah-backend.onrender.com
```

## 📝 Update Your .env File

**Replace your current .env content with:**
```
API_URL=https://navraah-backend.onrender.com
```

## 🚀 Steps to Fix Your App

1. **Update .env file** with the URL above
2. **Restart Metro bundler**:
   ```bash
   # Stop current Metro (Ctrl+C)
   start-app.bat
   ```
3. **Test login** with your backend credentials

## ⚠️ Important Notes

### Render Cold Starts
- First request might take 30-60 seconds if backend is sleeping
- Subsequent requests will be fast
- App waits indefinitely for response (no timeout)
- Loading indicator will show until response arrives

### Network Requirements
- Works on all platforms (Android Emulator, iOS Simulator, Physical Device)
- Requires internet connection
- Uses HTTPS (secure)

## 🔧 Troubleshooting

### If you see "Network Error":
1. Check internet connection
2. Wait for Render cold start (up to 60 seconds)
3. Check backend URL in .env file
4. Restart Metro bundler

### Test Backend Manually:
```bash
curl https://navraah-backend.onrender.com/api/users/login
```
Should return: `{"message":"Invalid email or password"}` (this is correct!)

## 📱 All Platforms Supported
With cloud backend, same URL works for:
- ✅ Android Emulator  
- ✅ iOS Simulator
- ✅ Physical Android Device
- ✅ Physical iOS Device 