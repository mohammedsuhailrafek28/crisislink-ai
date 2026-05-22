import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, RADIUS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';
import { Avatar } from '../../src/components';

export default function ProfileScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const uploadAvatar = useAuthStore((state) => state.uploadAvatar);
  const logout = useAuthStore((state) => state.logout);

  const [fullName, setFullName] = useState('');
  const [talentType, setTalentType] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setFullName(currentUser?.fullName ?? '');
    setTalentType(currentUser?.talentType ?? '');
    setBio(currentUser?.bio ?? '');
    setCity(currentUser?.city ?? '');
    setCountry(currentUser?.country ?? '');
    setSkillsInput((currentUser?.skills ?? []).join(', '));
  }, [currentUser]);

  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  const handleSave = async () => {
    if (!fullName || !talentType || !bio || !city || !country) {
      setError('Fill out the required profile fields');
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
    setSuccess('');

    try {
      await updateProfile({
        fullName,
        talentType,
        bio,
        city,
        country,
        skills,
      });
      setSuccess('Profile saved');
    } catch (err: any) {
      setError(err.message || 'Could not save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChooseAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Media library permission is required to set a profile photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets[0]?.base64) {
      return;
    }

    setAvatarLoading(true);
    setError('');
    setSuccess('');

    try {
      await uploadAvatar(result.assets[0].base64);
      setSuccess('Profile photo updated');
    } catch (err: any) {
      setError(err.message || 'Could not upload avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: COLORS.primary, fontFamily: FONTS.headingMedium, marginBottom: 8 }}>Your profile</Text>
        <Text style={{ color: COLORS.text, fontSize: 32, lineHeight: 36, fontFamily: FONTS.heading }}>Edit the details people see on your Kinship profile.</Text>
      </View>

      <View style={{ backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 }}>
        <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 6 }}>Account</Text>
        <Text style={{ color: COLORS.text, fontFamily: FONTS.headingMedium, fontSize: 18 }}>{currentUser.email}</Text>
        <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>{currentUser.verified ? 'Verified account' : 'Unverified account'}</Text>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={handleChooseAvatar} disabled={avatarLoading}>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.bgCard,
            overflow: 'hidden',
          }}>
            {avatarLoading ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              <Avatar user={currentUser} size={100} />
            )}
          </View>
        </TouchableOpacity>
        {!avatarLoading && !currentUser.profilePhoto && !currentUser.avatarUrl ? (
          <TouchableOpacity onPress={handleChooseAvatar} disabled={avatarLoading} style={{ marginTop: 10 }}>
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.headingMedium }}>Add profile photo</Text>
          </TouchableOpacity>
        ) : (
            <View
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: COLORS.primary, fontFamily: FONTS.headingMedium }}>{avatarLoading ? 'Uploading...' : 'Change profile photo'}</Text>
          </View>
          )}
      </View>

      {error ? <MessageBox tone="error" text={error} /> : null}
      {success ? <MessageBox tone="success" text={success} /> : null}

      <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Your name" loading={loading} autoCapitalize="words" />
      <Field label="Talent type" value={talentType} onChangeText={setTalentType} placeholder="Singer, dancer, chef..." loading={loading} autoCapitalize="words" />
      <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Write a short bio" loading={loading} autoCapitalize="sentences" multiline numberOfLines={4} />
      <Field label="City" value={city} onChangeText={setCity} placeholder="City" loading={loading} autoCapitalize="words" />
      <Field label="Country" value={country} onChangeText={setCountry} placeholder="Country" loading={loading} autoCapitalize="words" />
      <Field label="Skills" value={skillsInput} onChangeText={setSkillsInput} placeholder="music, branding, choreography" loading={loading} autoCapitalize="none" />

      <TouchableOpacity
        disabled={loading}
        onPress={handleSave}
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: RADIUS.md,
          padding: 14,
          alignItems: 'center',
          marginTop: 8,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontFamily: FONTS.headingMedium }}>Save changes</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        disabled={loading}
        onPress={handleLogout}
        style={{
          borderRadius: RADIUS.md,
          padding: 14,
          alignItems: 'center',
          marginTop: 12,
          borderWidth: 1,
          borderColor: COLORS.borderLight,
          backgroundColor: COLORS.bgCard,
        }}
      >
        <Text style={{ color: COLORS.text, fontSize: 16, fontFamily: FONTS.headingMedium }}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MessageBox({ tone, text }: { tone: 'error' | 'success'; text: string }) {
  return (
    <View
      style={{
        backgroundColor: tone === 'error' ? COLORS.errorBg : COLORS.successBg,
        borderRadius: RADIUS.md,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: tone === 'error' ? COLORS.error : COLORS.success }}>{text}</Text>
    </View>
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
