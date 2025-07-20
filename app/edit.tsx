import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReminderForm from '../components/ReminderForm';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useReminders } from '../hooks/useReminders';

export default function EditReminderScreen() {
  const router = useRouter();
  const { id, title, description } = useLocalSearchParams();
  const { updateReminder } = useReminders();

  const handleSubmit = (newTitle: string, newDescription: string) => {
    updateReminder({ id: id as string, title: newTitle, description: newDescription });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ReminderForm
        onSubmit={handleSubmit}
        initialValues={{ title: title as string, description: description as string }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
