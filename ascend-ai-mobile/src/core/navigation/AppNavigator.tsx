import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Target, CheckCircle2, User, Book } from 'lucide-react-native';
import { ROUTES } from '../constants/routes';
import { HomeScreen } from '@features/home/screens/HomeScreen';
import { GoalsScreen } from '@features/goals/screens/GoalsScreen';
import { HabitsScreen } from '@features/habits/screens/HabitsScreen';
import { JournalScreen } from '@features/journal/screens/JournalScreen';
import { ProfileScreen } from '@features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#2563EB', // blue-600
        tabBarInactiveTintColor: '#9CA3AF', // gray-400
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name={ROUTES.MISSIONS}
        component={HabitsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <CheckCircle2 color={color} size={size} />,
          tabBarLabel: 'Habits',
        }}
      />
      <Tab.Screen
        name={ROUTES.PROGRESS}
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
          tabBarLabel: 'Goals',
        }}
      />
      <Tab.Screen
        name={'Journal'}
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Book color={color} size={size} />,
          tabBarLabel: 'Journal',
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
