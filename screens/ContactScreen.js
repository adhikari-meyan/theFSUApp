import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ContactScreen() {
  const [category, setCategory] = useState('incident');
  const [description, setDescription] = useState('');

  const contactCategories = [
    { label: 'Report an Incident', value: 'incident' },
    { label: 'Suggest App Improvement', value: 'improvement' },
    { label: 'General Inquiry', value: 'inquiry' },
    { label: 'Event Proposal', value: 'event' },
    { label: 'Facility Feedback', value: 'facility' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="envelope" size={40} color="#1a73e8" />
        <Text style={styles.title}>Contact FSU</Text>
        <Text style={styles.subtitle}>
          We're here to help and value your feedback
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>What would you like to contact us about?</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
          >
            {contactCategories.map(cat => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Please provide details about your concern or suggestion..."
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.submitButton}>
          <Icon name="paper-plane" size={16} color="#fff" style={styles.submitIcon} />
          <Text style={styles.submitText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});