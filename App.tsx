// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { TamaguiProvider } from 'tamagui';
// import { ApolloProvider } from '@apollo/client';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { RootStackParamList } from './src/navigation/types';
// import tamaguiConfig from './tamagui.config';
// import { apolloClient } from './src/services/apollo';
// import { queryClient } from './src/services/rest';
// import { RootNavigator } from './src/navigation/RootNavigator';



// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <TamaguiProvider config={tamaguiConfig}>
//         <ApolloProvider client={apolloClient}>
//           <QueryClientProvider client={queryClient}>
//             <NavigationContainer>
//               <RootNavigator />
//             </NavigationContainer>
//           </QueryClientProvider>
//         </ApolloProvider>
//       </TamaguiProvider>
//     </SafeAreaProvider>
//   );
// }
