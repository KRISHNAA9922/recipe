import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/auth/login');
    }, 2000); // Redirect after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/splash-icon.png')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Recipe Book</Text>
      <Text style={styles.subtitle}>Your Personal Cooking Companion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171616ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#17d7c4ff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#17d7c4ff',
    opacity: 0.8,
  },
});
