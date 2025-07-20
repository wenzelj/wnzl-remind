import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, TextInput, useColorScheme, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ReminderCard from '../components/ReminderCard';
import { useReminders } from '../hooks/useReminders';
import { lightTheme, darkTheme } from '../constants/themes';

export default function HomeScreen() {
  const router = useRouter();
  const { reminders, deleteReminder } = useReminders();
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) =>
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reminders, searchQuery]);

  const handleEdit = (id: string) => {
    const reminder = reminders.find((r) => r.id === id);
    if (reminder) {
      router.push({
        pathname: '/edit',
        params: { id: reminder.id, title: reminder.title, description: reminder.description },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.input, color: theme.text }]}
        placeholder="Search by title..."
        placeholderTextColor={theme.text}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredReminders}
        renderItem={({ item }) => (
          <ReminderCard
            title={item.title}
            description={item.description}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => deleteReminder(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>No reminders yet. Add one!</Text>}
      />
      <Link href="/create" asChild>
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.fab }]}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    borderRadius: 30,
    elevation: 8,
  },
});
