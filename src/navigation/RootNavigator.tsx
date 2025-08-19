import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { AddRecipeScreen } from '../screens/AddRecipeScreen';
import { EditRecipeScreen } from '../screens/EditRecipeScreen';
import { RecipeNotesScreen } from '../screens/RecipeNotesScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Recipe Book' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen} 
        options={{ title: 'Recipe Details' }}
      />
      <Stack.Screen 
        name="AddRecipe" 
        component={AddRecipeScreen} 
        options={{ title: 'Add New Recipe' }}
      />
      <Stack.Screen 
        name="EditRecipe" 
        component={EditRecipeScreen} 
        options={{ title: 'Edit Recipe' }}
      />
      <Stack.Screen 
        name="RecipeNotes" 
        component={RecipeNotesScreen} 
        options={({ route }) => ({ title: route.params.recipeTitle })}
      />
    </Stack.Navigator>
  );
}
