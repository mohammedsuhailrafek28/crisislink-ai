import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useOpportunityDetail, useApplyOpportunity } from '../../src/hooks/useOpportunities';

export default function OpportunityDetail() {
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;
  const router = useRouter();

  const { data, isLoading } = useOpportunityDetail(id);
  const apply = useApplyOpportunity(id);

  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');

  const handleApply = async () => {
    try {
      await apply.mutateAsync({ coverLetter, portfolioLink });
      Alert.alert('Application sent');
      router.back();
    } catch (err: any) {
      Alert.alert('Apply failed', err?.response?.data?.message || err.message || 'Failed to apply');
    }
  };

  if (isLoading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>;

  if (!data) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: COLORS.textSecondary }}>Opportunity not found</Text></View>;

  const opp = data;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '700' }}>{opp.title}</Text>
      <Text style={{ color: COLORS.textSecondary, marginTop: 8 }}>{opp.talentType} • {opp.city}{opp.country ? `, ${opp.country}` : ''}</Text>

      <View style={{ marginTop: 12, backgroundColor: COLORS.bgCard, padding: 12, borderRadius: 10 }}>
        <Text style={{ color: COLORS.text }}>{opp.description}</Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <Text style={{ color: COLORS.textSecondary }}>Budget</Text>
        <Text style={{ color: COLORS.text }}>{opp.currency || 'USD'} {opp.budgetFrom ?? ''}{opp.budgetTo ? ` - ${opp.budgetTo}` : ''}</Text>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={{ color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Apply for this opportunity</Text>
        <TextInput placeholder="Cover letter" placeholderTextColor={COLORS.textTertiary} value={coverLetter} onChangeText={setCoverLetter} multiline numberOfLines={6} textAlignVertical="top" style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, height: 140, marginBottom: 12 }} />
        <TextInput placeholder="Portfolio link (optional)" placeholderTextColor={COLORS.textTertiary} value={portfolioLink} onChangeText={setPortfolioLink} style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, marginBottom: 12 }} />

        <TouchableOpacity disabled={apply.isLoading} onPress={handleApply} style={{ backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
          {apply.isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Send Application</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
