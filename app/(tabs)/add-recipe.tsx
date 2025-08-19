import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import { CREATE_RECIPE } from '../../src/graphql/queries';

export default function AddRecipeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('lunch');

  const [createRecipe, { loading }] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      Alert.alert('Success', 'Recipe saved successfully!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to save recipe: ${error.message}`);
    }
  });

  const handleSave = async () => {
    if (!title.trim() || !ingredients.trim() || !instructions.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const ingredientsArray = ingredients.split('\n').filter(i => i.trim());
      const stepsArray = instructions.split('\n').filter(i => i.trim());

      await createRecipe({
        variables: {
          input: {
            title: title.trim(),
            ingredients: ingredientsArray,
            steps: stepsArray,
            category,
            notes: description.trim(),
            image: ''
          }
        }
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Recipe</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Recipe Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter recipe title"
        />
        
        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., breakfast, lunch, dinner, dessert"
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description"
          multiline
        />
        
        <Text style={styles.label}>Ingredients * (one per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="e.g., 2 cups flour&#10;1 tsp salt&#10;3 eggs"
          multiline
        />
        
        <Text style={styles.label}>Instructions * (one step per line)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="e.g., Preheat oven to 350°F&#10;Mix dry ingredients&#10;Add wet ingredients"
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.saveButton, loading && styles.disabledButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Recipe'}
          </Text>
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
