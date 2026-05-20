import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useOpportunities } from '../../src/hooks/useOpportunities';

export default function OpportunitiesList() {
  const router = useRouter();
  const [talentType, setTalentType] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');

  const params = {
    talentType: talentType || undefined,
    city: city || undefined,
    country: country || undefined,
    budgetFrom: budgetFrom ? parseInt(budgetFrom) : undefined,
    budgetTo: budgetTo ? parseInt(budgetTo) : undefined,
    page: 1,
    limit: 50,
  } as any;

  const { data, isLoading, isFetching, refetch } = useOpportunities(params);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => router.push(`/opportunities/${item.id}`)} style={{ padding: 14, backgroundColor: COLORS.bgCard, borderRadius: 12, marginBottom: 12 }}>
      <Text style={{ color: COLORS.text, fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
      <Text style={{ color: COLORS.textSecondary, marginTop: 4 }}>{item.talentType} • {item.city}{item.country ? `, ${item.country}` : ''}</Text>
      <Text style={{ color: COLORS.textTertiary, marginTop: 8 }}>{item.description?.slice(0, 140)}{item.description && item.description.length > 140 ? '...' : ''}</Text>
      <View style={{ marginTop: 8 }}>
        <Text style={{ color: COLORS.textSecondary }}>{item.budgetFrom ? `${item.currency || 'USD'} ${item.budgetFrom}` : ''}{item.budgetTo ? ` - ${item.budgetTo}` : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
      <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Opportunities</Text>

      <View style={{ marginBottom: 12 }}>
        <TextInput placeholder="Talent Type" placeholderTextColor={COLORS.textTertiary} value={talentType} onChangeText={setTalentType} style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 10, borderRadius: 10, marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput placeholder="City" placeholderTextColor={COLORS.textTertiary} value={city} onChangeText={setCity} style={{ flex: 1, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 10, borderRadius: 10 }} />
          <TextInput placeholder="Country" placeholderTextColor={COLORS.textTertiary} value={country} onChangeText={setCountry} style={{ width: 120, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 10, borderRadius: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TextInput placeholder="Min Budget" placeholderTextColor={COLORS.textTertiary} value={budgetFrom} onChangeText={setBudgetFrom} keyboardType="numeric" style={{ flex: 1, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 10, borderRadius: 10 }} />
          <TextInput placeholder="Max Budget" placeholderTextColor={COLORS.textTertiary} value={budgetTo} onChangeText={setBudgetTo} keyboardType="numeric" style={{ width: 120, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 10, borderRadius: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10, gap: 8 }}>
          <TouchableOpacity onPress={() => refetch()} style={{ backgroundColor: COLORS.primary, padding: 10, borderRadius: 10 }}>
            <Text style={{ color: '#fff' }}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setTalentType(''); setCity(''); setCountry(''); setBudgetFrom(''); setBudgetTo(''); refetch(); }} style={{ backgroundColor: COLORS.bgCard, padding: 10, borderRadius: 10 }}>
            <Text style={{ color: COLORS.text }}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={data?.opportunities ?? []} keyExtractor={(i: any) => i.id} renderItem={renderItem} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} />
      )}

      {isFetching ? <View style={{ padding: 8 }}><ActivityIndicator /></View> : null}
    </View>
  );
}
