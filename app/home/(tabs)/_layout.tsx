// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { useTheme } from 'tamagui';
import { Home, Plus, User } from '@tamagui/lucide-icons';
import { ThemeContext } from '../../_layout'; // Import from root layout for theme access
import { AuthGuard } from '../../../src/components/auth/AuthGuard';

export default function TabLayout() {
  const tamaguiTheme = useTheme(); // Get current Tamagui theme tokens
  const { theme } = useContext(ThemeContext); // Get light/dark mode

  // Define dynamic colors based on theme
  const activeTintColor = tamaguiTheme.accent?.val || (theme === 'dark' ? '#00BFFF' : '#007AFF'); // Brighter blue for dark mode
  const inactiveTintColor = tamaguiTheme.color5?.val || (theme === 'dark' ? '#A9A9A9' : '#808080');
  const tabBarBackground = theme === 'dark' ? '#1A1A1A' : '#616161ff';
  const headerBackground = theme === 'dark' ? '#000000' : '#616161ff';
  const headerTint = theme === 'dark' ? '#616161ff' : '#333333';
  const borderColor = theme === 'dark' ? '#333333' : '#616161ff'; // Subtle border for light mode

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeTintColor,
          tabBarInactiveTintColor: inactiveTintColor,
          tabBarStyle: {
            backgroundColor: tabBarBackground,
            borderTopColor: borderColor,
            borderTopWidth: 1,
            height: 60, // Taller for better touch targets
            paddingBottom: 5, // Improve icon spacing
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: headerBackground,
            shadowColor: 'transparent', // Clean, flat design
          },
          headerTintColor: headerTint,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          header: () => null 
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Recipe Book',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Home
                color={color}
                size={size}
                strokeWidth={focused ? 2.5 : 1.75} // Emphasis on active tab
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add-recipe"
          options={{
            title: 'Add Recipe',
            tabBarLabel: 'Add',
            tabBarIcon: ({ color, size, focused }) => (
              <Plus
                color={color}
                size={size}
                strokeWidth={focused ? 2.5 : 1.75}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <User
                color={color}
                size={size}
                strokeWidth={focused ? 2.5 : 1.75}
              />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
