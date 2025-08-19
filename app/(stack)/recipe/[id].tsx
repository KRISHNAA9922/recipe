import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@apollo/client';
import { GET_RECIPE } from '../../../src/graphql/queries';
import { Recipe } from '../../../src/types'; // Ensure the Recipe type is imported

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { loading, error, data } = useQuery(GET_RECIPE, {
    variables: { id },
  });

  const handleEditRecipe = () => {
    router.push(`/edit-recipe/${id}`);
  };

  const handleAddNotes = () => {
    router.push(`/recipe-notes/${id}`);
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

  if (!data?.recipe) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  const recipe: Recipe = data.recipe; // Explicitly define the type for recipe
  console.log(recipe); // Log the recipe data to check the image field

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        {recipe.image && <Image source={{ uri: recipe.image }} style={styles.image} />}
        {/* <Text style={styles.description}>{recipe.notes}</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.map((ingredient: string, index: number) => (
          <Text key={index} style={styles.ingredient}>
            • {ingredient}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>{recipe.steps}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.detail}>Category: {recipe.category}</Text>
        <Text style={styles.detail}>Created: {new Date(parseInt(recipe.createdAt)).toLocaleDateString()}</Text>
        <Text style={styles.detail}>Last Updated: {new Date(parseInt(recipe.updatedAt)).toLocaleDateString()}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditRecipe}>
          <Text style={styles.actionButtonText}>Edit Recipe</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleAddNotes}>
          <Text style={styles.actionButtonText}>Add Notes</Text>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  actions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});
