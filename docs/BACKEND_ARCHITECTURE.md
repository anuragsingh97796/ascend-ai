# Ascend AI — Backend Architecture & Engineering Standards

Ascend AI Backend is constructed using **Spring Boot 3**, **Java 17/21**, **Spring Security (Stateless JWT)**, and **MongoDB**.

---

## 🏗️ Layered Architecture & Clean Architecture Principles

```
backend/
└── src/main/java/com/ascendai/
    ├── config/          # Security, Web & CORS configurations
    ├── constant/        # System constants & error messages
    ├── controller/      # REST API Controllers (HTTP request handlers)
    ├── dto/             # Data Transfer Objects & API Envelopes
    ├── entity/          # MongoDB Document Domain Entities
    ├── exception/       # Global Exception Handler & Custom Errors
    ├── mapper/          # DTO ↔ Entity conversion mappings
    ├── repository/      # Spring Data MongoDB Repository Interfaces
    ├── security/        # JWT Authentication Filter, UserDetails & Tokens
    ├── service/         # Business Logic Layer
    └── util/            # JwtUtils & Utility Helpers
```

### Key Components

1. **Controllers (`com.ascendai.controller`)**:
   - Handles incoming HTTP requests, validates DTO inputs, and delegates processing to service layer.
   - Enforces `@RestController` standard responses using unified `ApiResponse<T>`.

2. **Service Layer (`com.ascendai.service`)**:
   - Contains core business logic, validation algorithms, streak calculations, and JWT token management.

3. **Repositories (`com.ascendai.repository`)**:
   - Extends `MongoRepository<Entity, String>` for MongoDB CRUD operations.

4. **Security Layer (`com.ascendai.security`)**:
   - `SecurityFilterChain`: Configured for stateless session creation (`SessionCreationPolicy.STATELESS`).
   - `AuthTokenFilter`: Intercepts `Authorization: Bearer <jwt>` headers, parses token using `JwtUtils`, and populates `SecurityContextHolder`.
   - `RefreshTokenService`: Generates, verifies, and rotates refresh tokens.

---

## 🔒 Security Architecture

- **Password Hashing**: Passwords are encrypted using BCrypt (`BCryptPasswordEncoder`).
- **Access Tokens**: Short-lived HS256 Signed JWTs (24 hours expiration).
- **Refresh Tokens**: UUID-based refresh tokens stored in MongoDB with 7 days expiration.
