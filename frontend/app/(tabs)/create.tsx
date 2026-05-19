import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreatePost } from '../../src/hooks/useFeed';
import { COLORS } from '@/constants/theme';

export default function CreateScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const createPost = useCreatePost();

  const handlePost = async () => {
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createPost.mutateAsync({ content: content.trim() });
      setContent('');
      router.replace('/(tabs)/feed');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.primary, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
          Share with Kinship
        </Text>
        <Text style={{ color: COLORS.text, fontSize: 28, fontWeight: '700', lineHeight: 34 }}>
          Create a post and inspire others
        </Text>
      </View>

      {error ? (
        <View
          style={{
            backgroundColor: COLORS.errorBg,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: COLORS.error }}>{error}</Text>
        </View>
      ) : null}

      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: COLORS.textSecondary, fontSize: 12, marginBottom: 8 }}>
          What's on your mind?
        </Text>
        <TextInput
          placeholder="Share your thoughts, work, or inspiration..."
          placeholderTextColor={COLORS.textTertiary}
          value={content}
          onChangeText={setContent}
          editable={!loading}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={{
            minHeight: 150,
            backgroundColor: COLORS.bgCard,
            borderRadius: 14,
            padding: 12,
            color: COLORS.text,
            borderWidth: 1,
            borderColor: COLORS.border,
            fontFamily: 'Inter_400Regular',
          }}
        />
      </View>

      <TouchableOpacity
        disabled={loading || !content.trim()}
        onPress={handlePost}
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: 12,
          padding: 14,
          alignItems: 'center',
          opacity: loading || !content.trim() ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Post now</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
