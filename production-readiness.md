# Production Readiness Guide

This document outlines the configurations and prerequisites necessary to safely deploy Ascend AI to production (Milestone 14).

## 1. Environment Variables
You must set the following environment variables in your production environment. 

### Backend
- `MONGODB_URI`: The connection string for your production MongoDB instance (e.g. Atlas). Default fallback is `mongodb://localhost:27017/ascendai_db`.
- `JWT_SECRET`: A secure, 256-bit random string for signing JWT tokens. **CRITICAL:** Do not use the default fallback secret in production.
- `CORS_ALLOWED_ORIGINS`: A comma-separated list of allowed origins. Example: `https://your-frontend-domain.com,https://your-mobile-domain.com`. Default fallback is `http://localhost:3000,http://localhost:8081`.
- `OPENAI_API_KEY`: Your OpenAI key. If omitted, the AI Coach gracefully falls back to a deterministic mode.

### Web (Next.js)
- `NEXT_PUBLIC_API_URL`: The URL of your deployed Spring Boot backend API. Default fallback is `http://localhost:8080/api`.

### Mobile (React Native / Expo)
- `EXPO_PUBLIC_API_BASE_URL`: The URL of your deployed Spring Boot backend. Default fallback is `http://10.0.2.2:8080` (Android) or `http://localhost:8080` (iOS).

## 2. Security Considerations
- **Exception Leaking:** The backend API has been hardened to mask unhandled exceptions (HTTP 500) behind a generic `"An unexpected error occurred"` message to prevent internal data or stacktraces from leaking to end users.
- **Data Isolation:** JWT authentication implicitly scopes all CRUD operations to the logged-in user's ID, preventing users from accessing each other's data.

## 3. Known Limitations & Next Steps (Milestone 14)
- **Deployment:** The backend must be containerized (e.g., Docker) or deployed to a platform like Heroku/Render/AWS. 
- **Web App:** Deploy the Next.js app to Vercel or Netlify.
- **Mobile App:** Build production APK/IPA using Expo EAS Build.
