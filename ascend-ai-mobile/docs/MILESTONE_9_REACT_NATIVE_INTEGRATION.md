# Milestone 9 — React Native App Integration

## 1. Objective
Integrate the existing Ascend AI React Native mobile application with the existing Ascend AI backend architecture, enabling the mobile app to consume the core product functionality already established on the web application.

## 2. Mobile Architecture
The mobile architecture is built to mirror the web application's domain-driven structure, separated into distinct features (uth, goals, habits, journal, profile). Each feature encapsulates its own API, domain types, hooks, and screens, promoting modularity and maintainability.

## 3. React Native / Expo Stack
- **Framework:** React Native with Expo (SDK 57)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management (Client):** Zustand
- **State Management (Server):** React Query
- **Navigation:** React Navigation (Native Stack, Bottom Tabs)
- **Storage:** React Native MMKV for fast, synchronous key-value storage
- **Validation:** Zod with React Hook Form

## 4. Backend Integration
The mobile app successfully interfaces with the existing Spring Boot API backend. All REST endpoints map to the established controllers (AuthController, GoalController, HabitController, JournalController), utilizing standard JSON payloads.

## 5. Authentication
Authentication is handled via stateless JWT (JSON Web Tokens). 
- **Storage:** Tokens are persisted locally using eact-native-mmkv (STORAGE_KEYS.AUTH_TOKEN).
- **State:** uthStore (Zustand) manages the global authentication state (user, 	oken, isAuthenticated, isLoading), handling login, registration, and logout flows.
- **Interceptors:** Axios interceptors automatically inject the JWT into the Authorization header as a Bearer token for all protected API requests.

## 6. Navigation
- **RootNavigator:** Acts as the top-level switch, dynamically rendering either the AuthNavigator or the AppNavigator based on the user's isAuthenticated state from the uthStore.
- **AuthNavigator:** A native stack navigator handling public screens (LoginScreen, RegisterScreen).
- **AppNavigator:** A bottom tab navigator presenting the protected application features (HomeScreen, GoalsScreen, HabitsScreen, JournalScreen, ProfileScreen).

## 7. Goals Integration
Goals are fully integrated using custom React Query hooks (useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal). These hooks wrap the goalApi endpoints, enabling complete CRUD functionality (Create, Read, Update, Delete) synchronized with the backend.

## 8. Habits Integration
Habits utilize dedicated React Query hooks (useHabits, useCreateHabit, useCompleteHabit) communicating with the habitApi. 
- **Check-ins:** Users can mark habits as complete for the day via the API.
- **Statistics:** Streak data and statistics are fetched directly from the backend to populate the UI.

## 9. Journal Integration
Journal entries are supported via useJournalEntries and useCreateJournalEntry React Query hooks, mapping to the journalApi. 
- Users can fetch existing entries and create new ones.
- **Limitations:** Update and Delete operations have UI/backend mismatches or are missing from the current UI. See "Known Limitations" for details.

## 10. Profile Integration
The profile section provides a view of the current authenticated user's information, retrieved via the /api/users/me endpoint. 

## 11. React Query
Server state management and caching are handled centrally by React Query. 
- Custom hooks (e.g., useGoalsHooks.ts) encapsulate API calls, providing built-in loading states, error handling, and cache invalidation.
- Mutations automatically invalidate relevant queries (e.g., creating a goal invalidates the goals list cache), ensuring the UI remains perfectly in sync with the backend database.

## 12. API Configuration
A critical integration fix was implemented in pi.ts:
- **Path Correction:** The mobile app was updated to target the backend's actual routing structure (/api/... instead of /api/v1/...).
- **Journal Endpoint:** The journal endpoint was explicitly corrected from /api/journals to /api/journal to align with the Spring Boot @RequestMapping("/api/journal").

## 13. Testing
Comprehensive manual verification was performed against the live backend:
- **API connectivity:** PASS
- **Registration:** PASS
- **Login:** PASS
- **JWT authentication:** PASS
- **Protected navigation:** PASS
- **Dashboard:** PASS
- **Goals CRUD:** PASS
- **Habits creation/completion:** PASS
- **Habit statistics:** PASS
- **Journal create/read:** PASS
- **Current user:** PASS
- **Logout:** PASS
- **Protected access after logout:** PASS

## 14. Code Quality
Rigorous code quality checks were executed and successfully passed:
- **TypeScript:** PASS (	sc --noEmit returned 0 errors)
- **ESLint:** PASS (Config fixed to target src/, returned 0 errors, 0 warnings)
- **Prettier:** PASS (All files formatted successfully)
- **Expo web export/build simulation:** PASS (Metro bundler successfully compiled and exported the app)

## 15. Known Limitations
The following limitations are explicitly noted and have NOT been fixed in this milestone:
- **Habit uncomplete:** Not currently supported by the backend schema.
- **49-day calendar:** Still needs manual UI verification to ensure the calendar component renders properly.
- **Journal update:** UI and backend payload mismatch.
- **Journal delete:** Not currently available in the mobile UI.
- **Profile layout:** Still needs manual UI verification.
- **AI Coach:** Completely out of scope and not implemented for this milestone.

## 16. Final Status
The core Milestone 9 React Native integration is implemented, functional, and verified. The mobile client successfully communicates with the Spring Boot backend via authenticated API calls. The above limitations remain and will require future follow-up, but the architectural foundation and core flows are fully operational.
