import { Image, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

type AvatarUser = {
  fullName?: string | null;
  username?: string | null;
  profilePhoto?: string | null;
  avatarUrl?: string | null;
};

type AvatarProps = {
  user?: AvatarUser | null;
  size?: number;
};

export function Avatar({ user, size = 48 }: AvatarProps) {
  const imageUrl = user?.profilePhoto ?? user?.avatarUrl ?? null;
  const initials = (user?.fullName ?? user?.username ?? 'K')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const label = initials || 'K';

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: COLORS.bgElevated }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.bgElevated,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Text style={{ color: COLORS.text, fontWeight: '700', fontSize: Math.max(12, size * 0.35) }}>{label}</Text>
    </View>
  );
}
