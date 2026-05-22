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

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [talentType, setTalentType] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = useAuthStore((state) => state.register);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword || !talentType) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        fullName,
        email,
        password,
        talentType,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
      });
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 32,
              fontFamily: FONTS.heading,
              color: COLORS.text,
              marginBottom: 8,
            }}
          >
            Create your Kinship account
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
            Join the network and set up your talent profile.
          </Text>
        </View>

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

        <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your display name" loading={loading} autoCapitalize="words" />
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" loading={loading} autoCapitalize="none" keyboardType="email-address" />
        <Field label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" loading={loading} secureTextEntry autoCapitalize="none" />
        <Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" loading={loading} secureTextEntry autoCapitalize="none" />
        <Field label="Talent type" value={talentType} onChangeText={setTalentType} placeholder="Singer, dancer, chef..." loading={loading} autoCapitalize="words" />
        <Field label="City" value={city} onChangeText={setCity} placeholder="Optional" loading={loading} autoCapitalize="words" />
        <Field label="Country" value={country} onChangeText={setCountry} placeholder="Optional" loading={loading} autoCapitalize="words" />

        <TouchableOpacity
          disabled={loading}
          onPress={handleSignup}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.md,
            padding: 14,
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 16,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontFamily: FONTS.headingMedium }}>Create account</Text>}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Text style={{ color: COLORS.textSecondary }}>Already have an account? </Text>
          <TouchableOpacity disabled={loading} onPress={() => router.replace('/(auth)/login')}>
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.headingMedium }}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  loading,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  loading: boolean;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        value={value}
        onChangeText={onChangeText}
        editable={!loading}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize ?? 'none'}
        keyboardType={keyboardType ?? 'default'}
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
  );
}