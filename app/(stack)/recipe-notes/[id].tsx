import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function RecipeNotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('Sample Recipe');

  const handleSaveNotes = () => {
    // In a real app, you would save to your backend
    console.log('Saving notes for recipe:', { id, notes });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipeTitle} - Notes</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Your Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add your personal notes, tips, or modifications..."
          multiline
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveNotes}>
          <Text style={styles.saveButtonText}>Save Notes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});
