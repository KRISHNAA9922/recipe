import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          header: () => null 
        }} 
      />
      <Stack.Screen   
        name="login" 
        options={{ 
          title: 'Login', 
          header: () => null 
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'Register',
          header: () => null
        }} 
      />
      <Stack.Screen 
        name="recipe/[id]" 
        options={{ 
          title: 'Recipe Details',
          header: () => null
        }} 
      />
      <Stack.Screen 
        name="recipe-notes/[id]" 
        options={{ 
          title: 'Recipe Notes',
          header: () => null
        }} 
      />
      <Stack.Screen 
        name="edit-recipe/[id]" 
        options={{ 
          title: 'Edit Recipe',
          header: () => null
        }} 
      />
    </Stack>
  );
}
