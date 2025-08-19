import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECIPE, UPDATE_RECIPE } from '../../../src/graphql/queries';

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  // Fetch recipe data
  const { loading, error, data } = useQuery(GET_RECIPE, {
    variables: { id },
  });

  // Update recipe mutation
  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, {
    variables: { id },
    onCompleted: () => {
      router.back();
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
    },
  });

  useEffect(() => {
    if (data?.recipe) {
      setTitle(data.recipe.title);
      setDescription(data.recipe.description);
      setIngredients(data.recipe.ingredients.join('\n'));
      setInstructions(data.recipe.steps.join('\n'));
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateRecipe({
        variables: {
          id,
          input: {
            title,
            description,
            ingredients: ingredients.split('\n').filter(i => i.trim()),
            steps: instructions.split('\n').filter(i => i.trim()),
            category: data?.recipe?.category || 'General',
          },
        },
      });
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading recipe: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Recipe</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Recipe Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter recipe title"
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description"
          multiline
        />
        
        <Text style={styles.label}>Ingredients</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="List ingredients, one per line"
          multiline
        />
        
        <Text style={styles.label}>Instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Step-by-step instructions"
          multiline
        />
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={updating}>
          <Text style={styles.saveButtonText}>{updating ? 'Saving...' : 'Save Recipe'}</Text>
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
    minHeight: 100,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
});
