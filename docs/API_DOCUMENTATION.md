# Ascend AI — REST API Documentation

Base URL: `http://localhost:8080/api`

---

## 🔐 1. Authentication Endpoints (`/api/auth`)

### POST `/api/auth/register`
Creates a new user account.

**Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex@ascend.ai",
  "password": "Password123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": null,
  "timestamp": "2026-07-25T12:00:00"
}
```

---

### POST `/api/auth/login`
Authenticates a user and returns JWT Access & Refresh Tokens.

**Request Body**:
```json
{
  "email": "alex@ascend.ai",
  "password": "Password123!"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "e382d56a-79b8-4e12...",
    "type": "Bearer",
    "id": "60c72b2f9b1d8b2d88a1b2c3",
    "name": "Alex Mercer",
    "email": "alex@ascend.ai",
    "avatarInitials": "AM",
    "roles": ["USER"]
  },
  "timestamp": "2026-07-25T12:00:00"
}
```

---

### POST `/api/auth/refresh`
Refreshes an expired JWT access token using a valid refresh token.

**Request Body**:
```json
{
  "refreshToken": "e382d56a-79b8-4e12..."
}
```

---

### GET `/api/auth/me`
Retrieves current authenticated user context. Requires `Authorization: Bearer <token>`.

---

## 🎯 2. Goals Endpoints (`/api/goals`)
- `GET /api/goals` — List user goals
- `POST /api/goals` — Create a goal
- `PUT /api/goals/{id}` — Update goal & milestones
- `DELETE /api/goals/{id}` — Delete goal

## 🔥 3. Habits Endpoints (`/api/habits`)
- `GET /api/habits` — List user habits
- `POST /api/habits` — Create a habit
- `PUT /api/habits/{id}` — Log check-in & update streaks
- `DELETE /api/habits/{id}` — Delete habit

## 📖 4. Journal Endpoints (`/api/journal`)
- `GET /api/journal` — List journal entries
- `POST /api/journal` — Create reflection log
- `PUT /api/journal/{id}` — Update reflection log
- `DELETE /api/journal/{id}` — Delete reflection log

## 🧠 5. AI Coach Endpoints (`/api/coach`)
- `GET /api/coach/history` — Get chat thread
- `POST /api/coach/chat` — Send message to AI co-pilot
