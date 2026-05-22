import { View, Text } from 'react-native';
import { COLORS } from '../../src/constants/theme';

export default function CollabsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: COLORS.textSecondary }}>Collaborations Screen</Text>
    </View>
  );
}
