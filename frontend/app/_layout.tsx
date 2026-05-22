import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../src/store/auth.store';

const queryClient = new QueryClient();

export default function RootLayout() {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Load auth state from storage on app start
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
