import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/auth.store';
import { COLORS } from '../src/constants/theme';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);

  useEffect(() => {
    if (!isLoading) {
      // Redirect based on auth state
      if (isAuthenticated && !isProfileComplete) {
        router.replace('/onboarding');
      } else if (isAuthenticated) {
        router.replace('/(tabs)/feed');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading, isProfileComplete, router]);

  // Show loading spinner while checking auth state
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
