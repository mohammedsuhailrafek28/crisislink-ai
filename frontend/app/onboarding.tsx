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
import { useAuthStore } from '../src/store/auth.store';
import { COLORS, FONTS, RADIUS } from '../src/constants/theme';

const SKILL_EXAMPLES = ['music', 'dance', 'photography', 'cooking', 'design'];

export default function OnboardingScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [talentType, setTalentType] = useState(user?.talentType ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [city, setCity] = useState(user?.city ?? '');
  const [country, setCountry] = useState(user?.country ?? '');
  const [skillsInput, setSkillsInput] = useState((user?.skills ?? []).join(', '));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!fullName || !talentType || !bio || !city || !country) {
      setError('Complete your profile to continue');
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!skills.length) {
      setError('Add at least one skill');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateProfile({
        fullName,
        talentType,
        bio,
        city,
        country,
        skills,
      });
      router.replace('/(tabs)/feed');
    } catch (err: any) {
      setError(err.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ flexGrow: 1, padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTS.headingMedium, marginBottom: 8 }}>
          Profile setup
        </Text>
        <Text
          style={{
            fontSize: 30,
            lineHeight: 36,
            fontFamily: FONTS.heading,
            color: COLORS.text,
            marginBottom: 12,
          }}
        >
          Finish your profile before entering the feed.
        </Text>
        <Text style={{ color: COLORS.textSecondary, marginBottom: 24 }}>
          Tell people who you are and what you do so the app can match you with the right opportunities.
        </Text>

        {error ? (
          <View
            style={{
              backgroundColor: COLORS.errorBg,
              borderRadius: RADIUS.md,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: COLORS.error }}>{error}</Text>
          </View>
        ) : null}

        <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" loading={loading} autoCapitalize="words" />
        <Field label="Talent type" value={talentType} onChangeText={setTalentType} placeholder="Singer, dancer, chef..." loading={loading} autoCapitalize="words" />
        <Field label="Bio" value={bio} onChangeText={setBio} placeholder="A short intro about your work" loading={loading} autoCapitalize="sentences" multiline numberOfLines={4} />
        <Field label="City" value={city} onChangeText={setCity} placeholder="City" loading={loading} autoCapitalize="words" />
        <Field label="Country" value={country} onChangeText={setCountry} placeholder="Country" loading={loading} autoCapitalize="words" />
        <Field label="Skills" value={skillsInput} onChangeText={setSkillsInput} placeholder={SKILL_EXAMPLES.join(', ')} loading={loading} autoCapitalize="none" />

        <TouchableOpacity
          disabled={loading}
          onPress={handleContinue}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: RADIUS.md,
            padding: 14,
            alignItems: 'center',
            marginTop: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontFamily: FONTS.headingMedium, fontSize: 16 }}>Continue</Text>}
        </TouchableOpacity>
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
  autoCapitalize,
  multiline,
  numberOfLines,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  loading: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
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
        autoCapitalize={autoCapitalize ?? 'none'}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={{
          minHeight: multiline ? 110 : undefined,
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