import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reminder {
  id: string;
  title: string;
  description: string;
}

const REMINDERS_KEY = 'reminders';

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

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

  const addReminder = async (newReminder: Omit<Reminder, 'id'>) => {
    const reminderWithId = { ...newReminder, id: Date.now().toString() };
    const newReminders = [...reminders, reminderWithId];
    await saveReminders(newReminders);
  };

  const updateReminder = async (updatedReminder: Reminder) => {
    const newReminders = reminders.map((r) =>
      r.id === updatedReminder.id ? updatedReminder : r
    );
    await saveReminders(newReminders);
  };

  const deleteReminder = async (id: string) => {
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
