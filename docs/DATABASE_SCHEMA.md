# Ascend AI — MongoDB Database Schema Specification

Database Name: `ascendai_db`

---

## 🗄️ Collections Overview

### 1. `users`
Stores user profile, encrypted password, and assigned roles.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique Index)",
  "password": "String (BCrypt Encrypted)",
  "avatarInitials": "String",
  "roles": ["String"],
  "joinedAt": "ISODate"
}
```

### 2. `refresh_tokens`
Manages JWT refresh tokens for persistent authentication.
```json
{
  "_id": "ObjectId",
  "userId": "String",
  "token": "UUID String",
  "expiryDate": "ISODate"
}
```

### 3. `goals`
Tracks long-term objectives and micro-milestones.
```json
{
  "_id": "ObjectId",
  "userId": "String",
  "title": "String",
  "description": "String",
  "category": "String",
  "status": "active | completed | paused",
  "progress": "Number (0-100)",
  "targetDate": "String",
  "milestones": [
    {
      "id": "String",
      "title": "String",
      "completed": "Boolean",
      "completedAt": "String"
    }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 4. `habits`
Tracks daily habits and consecutive streaks.
```json
{
  "_id": "ObjectId",
  "userId": "String",
  "name": "String",
  "description": "String",
  "icon": "String",
  "color": "String",
  "frequency": "daily | weekdays",
  "currentStreak": "Number",
  "longestStreak": "Number",
  "completedDates": ["YYYY-MM-DD"],
  "createdAt": "ISODate"
}
```

### 5. `journal_entries`
Stores reflections and mental clarity logs.
```json
{
  "_id": "ObjectId",
  "userId": "String",
  "title": "String",
  "content": "String",
  "mood": "String",
  "tags": ["String"],
  "wordCount": "Number",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### 6. `coach_chats`
Stores AI co-pilot conversation threads.
```json
{
  "_id": "ObjectId",
  "userId": "String",
  "sender": "user | assistant",
  "text": "String",
  "timestamp": "ISODate"
}
```
