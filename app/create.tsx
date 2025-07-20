import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import ReminderForm from '../components/ReminderForm';
import { useRouter } from 'expo-router';
import * as Calendar from 'expo-calendar';
import { useReminders } from '../hooks/useReminders';

export default function CreateReminderScreen() {
  const router = useRouter();
  const { addReminder } = useReminders();
  const [calendarId, setCalendarId] = useState<string | null>(null);

  const createCalendar = React.useCallback(async () => {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar', type: Calendar.SourceType.LOCAL as Calendar.SourceType };
    const calendarConfig = {
      title: 'Expo Reminder App',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    };

    // Only add sourceId if it exists
    if ('id' in defaultCalendarSource && defaultCalendarSource.id) {
      // @ts-ignore
      calendarConfig.sourceId = defaultCalendarSource.id;
    }

    const newCalendarID = await Calendar.createCalendarAsync(calendarConfig);
    return newCalendarID;
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const appCalendar = calendars.find(
          ({ title }) => title === 'Expo Reminder App'
        );
        if (appCalendar) {
          setCalendarId(appCalendar.id);
        } else {
          const newCalendarId = await createCalendar();
          setCalendarId(newCalendarId);
        }
      }
    })();
  }, [createCalendar]);



  async function getDefaultCalendarSource() {
    const sources = await Calendar.getSourcesAsync();
    const defaultSource = sources.find(
      (source) => source.name === 'Default'
    );
    return defaultSource || sources[0];
  }

  const handleSubmit = async (title: string, description: string, date: Date, startTime: Date, endTime: Date, color: string) => {
    await addReminder({ title, description, date: date.toISOString(), startTime: startTime.toISOString(), endTime: endTime.toISOString(), color });

    if (!calendarId) {
      Alert.alert('Calendar permission not granted');
      router.back();
      return;
    }

    const event = {
      title,
      notes: description,
      startDate: startTime,
      endDate: endTime,
      timeZone: 'GMT',
    };

    try {
      await Calendar.createEventAsync(calendarId, event);
      Alert.alert('Reminder saved to calendar!');
    } catch (e) {
      console.warn(e);
    } finally {
      router.back();
    }
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
