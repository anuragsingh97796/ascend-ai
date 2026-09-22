# Ascend AI

Ascend AI is a comprehensive goal-tracking, habit-building, and AI-coaching platform consisting of three main components:
1. **Next.js Web Application** (Frontend)
2. **Spring Boot** (Backend API)
3. **React Native / Expo** (Mobile App)

## Project Structure

- `/` - Next.js Web Application
- `/backend` - Spring Boot Java Application
- `/ascend-ai-mobile` - React Native (Expo) Mobile Application

## Prerequisites

- Node.js (v18+)
- Java 17+
- Maven
- MongoDB (Running locally or via Atlas)
- Android Studio / Emulator (For Mobile development)

## Environment Variables

Check the provided `.env.example` file in the root directory for all required environment variables. 
Copy `.env.example` to `.env` in the root, and configure it accordingly for your local setup.

> **WARNING**: Never commit `.env` files or expose real secrets like JWT keys or OpenAI API keys in source control.

| Variable | Description | Component |
|---|---|---|
| `MONGODB_URI` | Connection string for MongoDB | Backend |
| `JWT_SECRET` | Secret key for JWT signing | Backend |
| `CORS_ALLOWED_ORIGINS` | Allowed origins (e.g., http://localhost:3000) | Backend |
| `OPENAI_API_KEY` | Key for AI integrations via Spring AI | Backend |
| `NEXT_PUBLIC_API_URL` | Base URL for backend API | Web |
| `EXPO_PUBLIC_API_URL` | Base URL for backend API | Mobile |

## Local Setup & Testing

### 1. Backend (Spring Boot)
1. Ensure MongoDB is running (e.g., on `localhost:27017`).
2. Navigate to backend: `cd backend`
3. Build the project: `mvn clean package -DskipTests` (or `.\mvnw clean package` if using wrapper)
4. Run the application: `mvn spring-boot:run`
5. The API will start on `http://localhost:8080`.

### 2. Web Application (Next.js)
1. In the project root, install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Mobile Application (React Native / Expo)
1. Navigate to mobile directory: `cd ascend-ai-mobile`
2. Install dependencies: `npm install`
3. Start the Expo server: `npm start` or `npx expo start --android`
4. This will open the app in your connected Android emulator or device.

## Deployment

### Deploying the Web App (Vercel)
The Next.js app is optimized for Vercel deployment.
1. Push your code to a GitHub repository.
2. Connect the repository in the Vercel dashboard.
3. Add the required environment variables (e.g., `NEXT_PUBLIC_API_URL`) in Vercel settings.
4. Deploy!

### Deploying the Backend (Docker)
A multi-stage `Dockerfile` is included in the `/backend` directory.
1. Build the Docker image: 
   ```bash
   cd backend
   docker build -t ascend-ai-backend .
   ```
2. Run the Docker container, providing necessary environment variables:
   ```bash
   docker run -p 8080:8080 -e MONGODB_URI=... -e JWT_SECRET=... -e OPENAI_API_KEY=... ascend-ai-backend
   ```
3. For cloud deployment (Render, AWS, Railway), simply link your repository and specify the `backend/Dockerfile` as the build source.
