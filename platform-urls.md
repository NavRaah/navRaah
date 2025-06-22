# Platform-Specific URLs for Your Backend

Your backend is running on port 3000. Use the appropriate URL for your platform:

## Android Emulator
```
API_URL=http://10.0.2.2:3000
```

## iOS Simulator  
```
API_URL=http://localhost:3000
```

## Physical Device (Android/iOS)
```
API_URL=http://192.168.18.249:3000
```

## Current Issue
Your .env file currently has: `http://192.168.28.249:3000`
But your computer's IP is: `192.168.18.249`

Update your .env file with the correct URL for your testing platform. 