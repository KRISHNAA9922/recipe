import {Stack } from 'expo-router';
import React, { useContext } from 'react';
import { Button, useTheme } from 'tamagui';
import { ThemeContext } from '../_layout'; // Import from root layout for theme access

export default function StackLayout() {
  const tamaguiTheme = useTheme(); // Get current Tamagui theme tokens
  const { theme } = useContext(ThemeContext); // Get light/dark mode

  // Define dynamic header styles based on theme
  const headerBackground = theme === 'dark' ? '#1A1A1A' : '#F8F9FA';
  const headerTint = theme === 'dark' ? '#FFFFFF' : '#333333';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: headerBackground,
        },
        headerTintColor: headerTint,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        presentation: 'card', // Default to card for smooth transitions
      }}
    >
      <Stack.Screen 
        name="recipe/[id]" 
        options={{ 
          title: 'Recipe Details', 
        }} 
      />
      <Stack.Screen 
        name="edit-recipe/[id]" 
        options={{ 
          title: 'Edit Recipe',
        }} 
      />
      <Stack.Screen 
        name="recipe-notes/[id]" 
        options={{ 
          title: 'Recipe Notes',
        }} 
      />
    </Stack>
  );
}
