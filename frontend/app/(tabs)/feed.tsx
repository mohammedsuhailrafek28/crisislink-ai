import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeed } from '../../src/hooks/useFeed';
import { useAuthStore } from '../../src/store/auth.store';
import { Avatar } from '../../src/components';
import { COLORS } from '@/constants/theme';

export default function FeedScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } = useFeed();

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Avatar user={currentUser} size={42} />
        </TouchableOpacity>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>Welcome back</Text>
          <Text style={{ color: COLORS.text, fontSize: 18, fontWeight: '600' }} numberOfLines={1}>
            {currentUser?.fullName ?? 'Kinship member'}
          </Text>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: any) => (
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              padding: 16,
            }}
          >
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <Avatar user={item.user} size={44} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 14, fontWeight: '600' }}>
                  {item.user.fullName}
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                  {item.user.talentType}
                </Text>
              </View>
            </View>
            <Text style={{ color: COLORS.text, fontSize: 15, lineHeight: 22, marginBottom: 12 }}>
              {item.content}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
                paddingTop: 12,
              }}
            >
              <TouchableOpacity>
                <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                  ❤️ {item.likeCount}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                  💬 {item.commentCount}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 20 }} /> : null
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: COLORS.textSecondary }}>
              {isLoading ? 'Loading...' : 'No posts yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
