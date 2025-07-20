import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface ReminderFormProps {
  onSubmit: (title: string, description: string) => void;
  initialValues?: { title: string; description: string };
}

const ReminderForm: React.FC<ReminderFormProps> = ({ onSubmit, initialValues }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');

  const handleSubmit = () => {
    onSubmit(title, description);
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
