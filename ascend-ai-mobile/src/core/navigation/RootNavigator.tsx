import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { ROUTES } from '@core/constants/routes';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuthStore } from '@features/auth/store/authStore';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {isAuthenticated ? (
          <Stack.Screen name={ROUTES.APP_STACK} component={AppNavigator} />
        ) : (
          <Stack.Screen name={ROUTES.AUTH_STACK} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
