import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReminderForm from '../components/ReminderForm';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useReminders } from '../hooks/useReminders';
import { Availability, RecurrenceRule } from 'expo-calendar';

export default function EditReminderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateReminder } = useReminders();

  const handleSubmit = (newTitle: string, newDescription: string, newDate: Date, newStartTime: Date, newEndTime: Date, newColor: string, newAvailability: Availability, newRecurrenceRule: RecurrenceRule, newLocation: string, newUrl: string, newTimeZone: string) => {
    updateReminder({
      ...(params as any),
      title: newTitle,
      description: newDescription,
      date: newDate.toISOString(),
      startTime: newStartTime.toISOString(),
      endTime: newEndTime.toISOString(),
      color: newColor,
      availability: newAvailability,
      recurrenceRule: newRecurrenceRule,
      location: newLocation,
      url: newUrl,
      timeZone: newTimeZone,
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ReminderForm
        onSubmit={handleSubmit}
        initialValues={params}
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
