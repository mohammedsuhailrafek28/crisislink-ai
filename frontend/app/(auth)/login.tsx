import { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/auth.store';
import { COLORS, FONTS, RADIUS } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: 'center',
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 40 }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: FONTS.heading,
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            Welcome to Kinship
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: COLORS.textSecondary,
            }}
          >
            Connect with talent creators and opportunities
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View
            style={{
              backgroundColor: COLORS.errorBg,
              borderRadius: RADIUS.md,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: COLORS.error, fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

        {/* Email Input */}
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            Email
          </Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={COLORS.textTertiary}
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: RADIUS.md,
              padding: 12,
              color: COLORS.text,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          />
        </View>

        {/* Password Input */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              color: COLORS.textSecondary,
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            Password
          </Text>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={COLORS.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: RADIUS.md,
              padding: 12,
              color: COLORS.text,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.md,
            padding: 14,
            alignItems: 'center',
            marginBottom: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontFamily: FONTS.headingMedium,
              }}
            >
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ color: COLORS.textSecondary }}>Don't have an account? </Text>
          <TouchableOpacity disabled={loading} onPress={() => router.push('/(auth)/signup')}>
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: FONTS.headingMedium,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
