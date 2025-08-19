import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_NOTE, UPDATE_NOTE, GET_NOTES } from '../../../src/graphql/queries';

export default function RecipeNotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('Sample Recipe');
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);

  // Query existing notes for this recipe
  const { data: notesData, loading: notesLoading, error: notesError } = useQuery(GET_NOTES, {
    variables: { recipeId: id },
    skip: !id,
  });

  // Mutations
  const [createNote, { loading: createLoading }] = useMutation(CREATE_NOTE);
  const [updateNote, { loading: updateLoading }] = useMutation(UPDATE_NOTE);

  useEffect(() => {
    if (notesData?.notes && notesData.notes.length > 0) {
      const latestNote = notesData.notes[0];
      setNotes(latestNote.content);
      setExistingNoteId(latestNote.id);
    }
  }, [notesData]);

  const handleSaveNotes = async () => {
    if (!notes.trim()) {
      alert('Please enter some notes');
      return;
    }

    try {
      if (existingNoteId) {
        // Update existing note
        await updateNote({
          variables: {
            id: existingNoteId,
            content: notes,
          },
        });
      } else {
        // Create new note
        await createNote({
          variables: {
            input: {
              recipeId: id,
              content: notes,
            },
          },
        });
      }
      router.back();
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    }
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
