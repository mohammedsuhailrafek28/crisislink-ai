import { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useCreateOpportunity } from '../../src/hooks/useOpportunities';

export default function GigsScreen() {
  const router = useRouter();
  const create = useCreateOpportunity();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [talentType, setTalentType] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [eventDate, setEventDate] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!title.trim() || !description.trim() || !talentType.trim()) {
      setError('Please fill required fields (title, description, talent type)');
      return;
    }

    try {
      await create.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        talentType: talentType.trim(),
        city: city.trim(),
        country: country.trim(),
        budgetFrom: budgetFrom ? parseFloat(budgetFrom) : 0,
        budgetTo: budgetTo ? parseFloat(budgetTo) : 0,
        currency: currency.trim(),
        eventDate: eventDate ? new Date(eventDate) : new Date(),
        duration: duration.trim(),
      });

      router.replace('/(tabs)/gigs');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to create opportunity');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Post a Gig</Text>
      <Text style={{ color: COLORS.textSecondary, marginBottom: 16 }}>Create an opportunity to hire talent</Text>

      {error ? (
        <View style={{ backgroundColor: COLORS.errorBg, padding: 10, borderRadius: 10, marginBottom: 12 }}>
          <Text style={{ color: COLORS.error }}>{error}</Text>
        </View>
      ) : null}

      <TextInput placeholder="Title" placeholderTextColor={COLORS.textTertiary} value={title} onChangeText={setTitle} style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, marginBottom: 12 }} />

      <TextInput placeholder="Description" placeholderTextColor={COLORS.textTertiary} value={description} onChangeText={setDescription} multiline numberOfLines={6} textAlignVertical="top" style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, height: 140, marginBottom: 12 }} />

      <TextInput placeholder="Talent Type (e.g. singing)" placeholderTextColor={COLORS.textTertiary} value={talentType} onChangeText={setTalentType} style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, marginBottom: 12 }} />

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="City" placeholderTextColor={COLORS.textTertiary} value={city} onChangeText={setCity} style={{ flex: 1, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
        <TextInput placeholder="Country" placeholderTextColor={COLORS.textTertiary} value={country} onChangeText={setCountry} style={{ width: 120, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="Budget From" placeholderTextColor={COLORS.textTertiary} keyboardType="numeric" value={budgetFrom} onChangeText={setBudgetFrom} style={{ flex: 1, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
        <TextInput placeholder="Budget To" placeholderTextColor={COLORS.textTertiary} keyboardType="numeric" value={budgetTo} onChangeText={setBudgetTo} style={{ width: 140, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput placeholder="Currency" placeholderTextColor={COLORS.textTertiary} value={currency} onChangeText={setCurrency} style={{ width: 120, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
        <TextInput placeholder="Event Date (YYYY-MM-DD)" placeholderTextColor={COLORS.textTertiary} value={eventDate} onChangeText={setEventDate} style={{ flex: 1, backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10 }} />
      </View>

      <TextInput placeholder="Duration (e.g. 2 hours)" placeholderTextColor={COLORS.textTertiary} value={duration} onChangeText={setDuration} style={{ backgroundColor: COLORS.bgCard, color: COLORS.text, padding: 12, borderRadius: 10, marginBottom: 20 }} />

      <TouchableOpacity disabled={create.isLoading} onPress={handleSubmit} style={{ backgroundColor: COLORS.primary, padding: 14, borderRadius: 12, alignItems: 'center' }}>
        {create.isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Post Opportunity</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
