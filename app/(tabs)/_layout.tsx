import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recipe Book',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="add-recipe"
        options={{
          title: 'Add Recipe',
          tabBarLabel: 'Add',
        }}
      />
    </Tabs>
  );
}
