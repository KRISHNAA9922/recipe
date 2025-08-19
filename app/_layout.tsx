import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { ApolloProvider } from '@apollo/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import tamaguiConfig from '../tamagui.config';
import { apolloClient } from '../src/services/apollo';
import { queryClient } from '../src/services/rest';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ApolloProvider client={apolloClient}>
          <QueryClientProvider client={queryClient}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </QueryClientProvider>
        </ApolloProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
