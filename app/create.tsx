import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ReminderForm from '../components/ReminderForm';
import { useRouter } from 'expo-router';
import { useReminders } from '../hooks/useReminders';
import { Availability, RecurrenceRule } from 'expo-calendar';

export default function CreateReminderScreen() {
  const router = useRouter();
  const { addReminder } = useReminders();

  const handleSubmit = async (title: string, description: string, date: Date, startTime: Date, endTime: Date, color: string, availability: Availability, recurrenceRule: RecurrenceRule, location: string, url: string, timeZone: string) => {
    await addReminder({ title, description, date: date.toISOString(), startTime: startTime.toISOString(), endTime: endTime.toISOString(), color, availability, recurrenceRule, location, url, timeZone });
    Alert.alert('Reminder saved to calendar!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <ReminderForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
