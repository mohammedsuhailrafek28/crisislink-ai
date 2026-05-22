import { View, Text } from 'react-native';
import { COLORS } from '../../src/constants/theme';

export default function MessagesScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: COLORS.textSecondary }}>Messages Screen</Text>
    </View>
  );
}
