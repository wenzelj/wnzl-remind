import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Availability, RecurrenceRule } from 'expo-calendar';

interface ReminderFormProps {
  onSubmit: (title: string, description: string, date: Date, startTime: Date, endTime: Date, color: string, availability: Availability, recurrenceRule: RecurrenceRule, location: string, url: string, timeZone: string) => void;
  initialValues?: { title: string; description: string; date: Date; startTime: Date; endTime: Date, color: string, availability: Availability, recurrenceRule: RecurrenceRule, location: string, url: string, timeZone: string };
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState(initialValues?.date ? new Date(initialValues.date) : new Date());
  const [startTime, setStartTime] = useState(initialValues?.startTime ? new Date(initialValues.startTime) : new Date());
  const [endTime, setEndTime] = useState(initialValues?.endTime ? new Date(initialValues.endTime) : new Date());
  const [color, setColor] = useState(initialValues?.color || 'blue');
  const [availability, setAvailability] = useState<Availability>(initialValues?.availability || 'busy');
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>(initialValues?.recurrenceRule || { frequency: 'daily', interval: 1 });
  const [location, setLocation] = useState(initialValues?.location || '');
  const [url, setUrl] = useState(initialValues?.url || '');
  const [timeZone, setTimeZone] = useState(initialValues?.timeZone || 'GMT');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = () => {
    onSubmit(title, description, date, startTime, endTime, color, availability, recurrenceRule, location, url, timeZone);
    setTitle('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.input}>
        <Text>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setStartTime(selectedTime);
            }
          }}
        />
      )}
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.input}>
        <Text>{endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setEndTime(selectedTime);
            }
          }}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Color"
        value={color}
        onChangeText={setColor}
      />
      <Picker
        selectedValue={availability}
        style={styles.input}
        onValueChange={(itemValue) => setAvailability(itemValue)}
      >
        <Picker.Item label="Busy" value="busy" />
        <Picker.Item label="Free" value="free" />
        <Picker.Item label="Tentative" value="tentative" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="URL"
        value={url}
        onChangeText={setUrl}
      />
      <TextInput
        style={styles.input}
        placeholder="Time Zone"
        value={timeZone}
        onChangeText={setTimeZone}
      />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default ReminderForm;
