export const ROUTES = {
  // Root Stacks
  AUTH_STACK: 'AuthStack',
  APP_STACK: 'AppStack',

  // Auth Screens
  LOGIN: 'Login',
  REGISTER: 'Register',

  // App / Main Screens
  HOME: 'Home',
  MISSIONS: 'Missions',
  PROGRESS: 'Progress',
  JOURNAL: 'Journal',
  PROFILE: 'Profile',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export default ROUTES;
