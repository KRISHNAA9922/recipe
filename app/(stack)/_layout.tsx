import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
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
        name="recipe/[id]" 
        options={{ 
          title: 'Recipe Details',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="edit-recipe/[id]" 
        options={{ 
          title: 'Edit Recipe',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="recipe-notes/[id]" 
        options={{ 
          title: 'Recipe Notes',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}
