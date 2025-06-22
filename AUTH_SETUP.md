# Authentication Setup Guide

## Overview
This React Native app uses a context-based authentication system with token storage and automatic API configuration for real backend integration.

## Files Structure
```
src/
├── api/
│   └── apiConfig.js       # Main API configuration with interceptors
├── context/
│   └── AuthContext.jsx    # Authentication context provider
└── screens/Auth/
    ├── LoginScreen.jsx    # Login interface
    └── RegisterScreen.jsx # Registration interface
```

## Setup Instructions

### 1. Backend URL Configuration
Edit `src/api/apiConfig.js` and update the API_URL:
```javascript
const API_URL = 'http://10.0.2.2:5000'; // For Android Emulator
// const API_URL = 'http://localhost:5000'; // For iOS Simulator  
// const API_URL = 'http://192.168.1.100:5000'; // For Physical Device
```

**Important URL Notes:**
- **Android Emulator**: Use `http://10.0.2.2:5000` (maps to localhost on host machine)
- **iOS Simulator**: Use `http://localhost:5000` or your computer's IP
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.100:5000`)

### 2. Backend Requirements
Your backend should provide these endpoints:

#### Authentication Endpoints:
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration  
- `POST /api/users/logout` - User logout
- `POST /api/users/forgot-password` - Password reset request
- `POST /api/users/reset-password` - Password reset confirmation

#### Expected Request/Response Format:

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "accessToken": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "user", // "admin", "driver", or "user"
    "phone": "+1234567890"
  }
}
```

**Register Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com", 
  "password": "password123",
  "phone": "+1234567890"
}
```

### 3. Starting the App
Use the provided batch script to start the app:
```bash
# On Windows
start-app.bat

# Or manually:
taskkill /f /im node.exe
npx react-native start --reset-cache
```

### 4. Network Error Troubleshooting

#### Common Issues:
1. **Connection Refused**: Backend server not running
2. **Network Request Failed**: Wrong API_URL in .env file
3. **Timeout**: Server taking too long to respond

#### Solutions:
1. **Check Backend Server**: Ensure it's running on the correct port
2. **Verify API_URL**: Use appropriate URL for your platform (see step 1)
3. **Check Network**: Ensure device/emulator can reach the server
4. **Firewall**: Make sure firewall allows connections on the port

#### Debug Steps:
1. Check console logs for detailed error messages
2. Test API endpoints with Postman/curl
3. Verify .env file is correctly formatted
4. Restart Metro bundler after changing .env

### 5. Usage in Components

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MyComponent = () => {
  const { login, register, logout, userInfo, loading } = useContext(AuthContext);
  
  // Use authentication functions
  const handleLogin = async () => {
    try {
      await login('email@test.com', 'password');
      // Navigate to appropriate screen based on userInfo.role
    } catch (error) {
      // Handle login error
    }
  };
  
  return (
    // Your component JSX
  );
};
```

### 6. Role-Based Navigation
The app supports role-based navigation:
- **admin**: Navigate to `AdminHome`
- **driver**: Navigate to `DriverHome` 
- **user**: Navigate to `UserHome`

Make sure these routes are defined in your navigation configuration.

## Security Features
- Automatic token storage in AsyncStorage
- Request interceptors for adding auth headers
- Response interceptors for handling token expiration
- Secure token removal on logout
- Network error handling with user-friendly messages

## Quick Start Instructions
1. **Update Backend URL**: Edit `src/api/apiConfig.js` with your backend URL
2. **Start the App**: Run `start-app.bat` or manually kill node processes and start fresh
3. **Test Login**: Use your real backend credentials to test authentication

## Restart Instructions
After making changes to API configuration:
1. Stop Metro bundler (`Ctrl+C`)
2. Kill existing node processes: `taskkill /f /im node.exe`
3. Clear cache: `npx react-native start --reset-cache`
4. Rebuild the app for the platform you're testing 