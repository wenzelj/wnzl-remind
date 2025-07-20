import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  calendarEventId?: string;
}

const REMINDERS_KEY = 'reminders';
const CALENDAR_NAME = 'Expo Reminder App';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [calendarId, setCalendarId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        let calendar = calendars.find(c => c.title === CALENDAR_NAME);
        if (!calendar) {
          calendar = await createCalendar();
        }
        if (calendar) {
          setCalendarId(calendar.id);
        }
      }
    })();
  }, []);

  const createCalendar = async () => {
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar', type: Calendar.SourceType.LOCAL as Calendar.SourceType };

    const newCalendarID = await Calendar.createCalendarAsync({
      title: CALENDAR_NAME,
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });

    return (await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)).find(c => c.id === newCalendarID);
  };

  async function getDefaultCalendarSource() {
    const sources = await Calendar.getSourcesAsync();
    const defaultSource = sources.find(
      (source) => source.name === 'Default'
    );
    return defaultSource || sources[0];
  }

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const storedReminders = await AsyncStorage.getItem(REMINDERS_KEY);
        if (storedReminders) {
          setReminders(JSON.parse(storedReminders));
        }
      } catch (e) {
        console.error('Failed to load reminders.', e);
      }
    };

    loadReminders();
  }, []);

  const saveReminders = async (newReminders: Reminder[]) => {
    try {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
      setReminders(newReminders);
    } catch (e) {
      console.error('Failed to save reminders.', e);
    }
  };

  const addReminder = async (newReminder: Omit<Reminder, 'id' | 'calendarEventId'>) => {
    let calendarEventId;
    if (calendarId) {
      calendarEventId = await Calendar.createEventAsync(calendarId, {
        title: newReminder.title,
        notes: newReminder.description,
        startDate: new Date(newReminder.startTime),
        endDate: new Date(newReminder.endTime),
        timeZone: 'GMT',
      });
    }

    const reminderWithId = { ...newReminder, id: Date.now().toString(), calendarEventId };
    const newReminders = [...reminders, reminderWithId];
    await saveReminders(newReminders);
  };

  const updateReminder = async (updatedReminder: Reminder) => {
    if (updatedReminder.calendarEventId && calendarId) {
      await Calendar.updateEventAsync(updatedReminder.calendarEventId, {
        title: updatedReminder.title,
        notes: updatedReminder.description,
        startDate: new Date(updatedReminder.startTime),
        endDate: new Date(updatedReminder.endTime),
        timeZone: 'GMT',
      });
    }

    const newReminders = reminders.map((r) =>
      r.id === updatedReminder.id ? updatedReminder : r
    );
    await saveReminders(newReminders);
  };

  const deleteReminder = async (id: string) => {
    const reminderToDelete = reminders.find(r => r.id === id);
    if (reminderToDelete && reminderToDelete.calendarEventId) {
      await Calendar.deleteEventAsync(reminderToDelete.calendarEventId);
    }

    const newReminders = reminders.filter((r) => r.id !== id);
    await saveReminders(newReminders);
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
  };
}
