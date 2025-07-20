import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../constants/themes';

interface ReminderCardProps {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({ title, description, date, startTime, endTime, color, onEdit, onDelete }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderLeftColor: color, borderLeftWidth: 5 }]}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={{ color: theme.text }}>{description}</Text>
        <Text style={styles.time}>{new Date(date).toDateString()}</Text>
        <Text style={styles.time}>{new Date(startTime).toLocaleTimeString()} - {new Date(endTime).toLocaleTimeString()}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="pencil" size={24} color={theme.fab} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    gap: 15
  },
});

export default ReminderCard;
