# Ascend AI — JWT Authentication & Refresh Token Architecture

```
+----------------+          +-----------------------+          +------------------+
|  Next.js 16    |          |  Spring Boot 3        |          |  MongoDB         |
|  Frontend      |          |  Backend Service      |          |  Database        |
+-------+--------+          +-----------+-----------+          +--------+---------+
        |                               |                           |
        |--- POST /api/auth/login ------>|                           |
        |    (email, password)          |--- Verify BCrypt Hash --->|
        |                               |<-- Return User Doc -------|
        |<-- Return JWT + RefreshToken -|                           |
        |                               |                           |
        |--- GET /api/goals ------------>|                           |
        |    Header: Bearer <jwt>       |--- AuthTokenFilter ------>|
        |                               |    Validate Claims        |
        |<-- Return 200 OK + Data ------|                           |
        |                               |                           |
        | (If JWT Expired - 401)        |                           |
        |--- POST /api/auth/refresh --->|                           |
        |    (refreshToken)             |--- Validate in DB ------->|
        |<-- Return New JWT Access Token|                           |
```

## JWT Security Rules
1. **Short-Lived Access Tokens**: Encoded with HMAC-SHA256 signature, 24-hour expiration.
2. **Stateless Filter Chain**: Every request is authenticated by `AuthTokenFilter` via HTTP header `Authorization: Bearer <token>`.
3. **Automatic Interceptor**: Axios client (`src/infrastructure/api/apiClient.ts`) catches `401 Unauthorized` responses and silently requests a new Access Token using the persistent `RefreshToken`.
