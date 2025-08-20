// app/_layout.tsx

import { Stack } from 'expo-router';
import { TamaguiProvider, Theme } from 'tamagui';
import { ApolloProvider } from '@apollo/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import tamaguiConfig from '../tamagui.config';
import apolloClient from '../src/services/apollo';
import { queryClient } from '../src/services/rest';
import { AuthProvider } from '../src/contexts/AuthContext';

// 1. Create a Context to hold the theme state and setter function
// This allows any component in your app to access and change the theme.
export const ThemeContext = createContext({
  theme: 'light' as 'light' | 'dark',
  setTheme: (theme: 'light' | 'dark') => {},
});

export default function RootLayout() {
  // 2. Get the user's preferred color scheme from the device (light/dark)
  const colorScheme = useColorScheme();

  // 3. Manage the current theme state. Default to the system's preference.
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );

  // Update the theme if the user changes their system settings while the app is open
  useEffect(() => {
    setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  return (
    // 4. Provide the theme state and setter to the entire app
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>
      <SafeAreaProvider>
        {/* TamaguiProvider provides the component configuration */}
        <TamaguiProvider config={tamaguiConfig} defaultTheme={currentTheme}>
          {/* Theme component applies the actual theme (e.g., colors, fonts) */}
          <Theme name={currentTheme}>
            <ApolloProvider client={apolloClient}>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <Stack>
                    <Stack.Screen name="splash" options={{ headerShown: false }} />
                    <Stack.Screen name="(stack)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  </Stack>
                </AuthProvider>
              </QueryClientProvider>
            </ApolloProvider>
          </Theme>
        </TamaguiProvider>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
}
