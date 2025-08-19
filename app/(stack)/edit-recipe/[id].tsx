import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
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
  const [category, setCategory] = useState('lunch');

  const { loading: loadingRecipe, error: errorRecipe, data } = useQuery(GET_RECIPE, {
    variables: { id },
    onCompleted: (data) => {
      if (data?.recipe) {
        setTitle(data.recipe.title);
        setDescription(data.recipe.notes || '');
        setCategory(data.recipe.category);
        setIngredients(data.recipe.ingredients.join('\n'));
        setInstructions(data.recipe.steps.join('\n'));
      }
    }
  });

  const [updateRecipe, { loading: updating }] = useMutation(UPDATE_RECIPE, {
    onCompleted: () => {
      Alert.alert('Success', 'Recipe updated successfully!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to update recipe: ${error.message}`);
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

      await updateRecipe({
        variables: {
          id,
          input: {
            title: title.trim(),
            ingredients: ingredientsArray,
            steps: stepsArray,
            category,
            notes: description.trim(),
            image: data?.recipe?.image || ''
          }
        }
      });
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  if (loadingRecipe) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading recipe...</Text>
      </View>
    );
  }

  if (errorRecipe) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading recipe: {errorRecipe.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Recipe</Text>
      
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
          style={[styles.saveButton, updating && styles.disabledButton]} 
          onPress={handleSave}
          disabled={updating}
        >
          <Text style={styles.saveButtonText}>
            {updating ? 'Updating...' : 'Update Recipe'}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
});
