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
export const ThemeContext = createContext({
  theme: 'light' as 'light' | 'dark',
  setTheme: (theme: 'light' | 'dark') => {},
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    setCurrentTheme(colorScheme === 'dark' ? 'dark' : 'light');
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, setTheme: setCurrentTheme }}>
      <SafeAreaProvider>
        <TamaguiProvider config={tamaguiConfig} defaultTheme={currentTheme}>
          <Theme name={currentTheme}>
            <ApolloProvider client={apolloClient}>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <Stack
                    screenOptions={{
                       header: () => null 
                    }}
                  >
                    <Stack.Screen name="splash" />
                    <Stack.Screen name="auth" />  {/* Add this line */}
                    <Stack.Screen name="(stack)" />
                    <Stack.Screen name="home" />
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
