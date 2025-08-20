// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../../src/graphql/loginQueries';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [login, { loading }] = useMutation(LOGIN_MUTATION);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 5000);
  };

  const handleLogin = async () => {
    console.log('Login attempt started');
    setMessage('');
    
    if (!email || !password) {
      showMessage('Please fill in all fields', 'error');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    showMessage('Logging you in...', 'info');

    try {
      console.log('Sending login request...');
      const { data } = await login({
        variables: {
          input: { email, password }
        }
      });

      console.log('Login response received:', data);

      if (data?.login?.token) {
        showMessage('Login successful! Redirecting...', 'success');
        
        await authLogin(data.login.token, data.login.user);
        console.log('Auth context updated successfully');
        
        setTimeout(() => {
          router.replace('/home');
        }, 1000);
      } else {
        console.log('No token in response');
        showMessage('Login failed - invalid response from server', 'error');
        Alert.alert('Login Failed', 'Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Failed to login. Please try again.';
      showMessage(errorMessage, 'error');
      Alert.alert('Login Error', errorMessage);
    }
  };

  const getMessageStyle = (type: 'success' | 'error' | 'info' | null) => {
  switch (type) {
    case 'success':
      return styles.messageSuccess;
    case 'error':
      return styles.messageError;
    case 'info':
      return styles.messageInfo;
    default:
      return {};
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
     {message && (
  <View style={[styles.messageContainer, getMessageStyle(messageType)]}>
    <Text style={styles.messageText}>{message}</Text>
  </View>
)}
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setMessage(''); // Clear message on input
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setMessage(''); // Clear message on input
        }}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator color="#17d7c4ff" size="small" />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>Logging in...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.push('/auth/register')}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#17d7c4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  messageSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  messageError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  messageInfo: {
    backgroundColor: '#cce7ff',
    borderColor: '#b3d9ff',
    borderWidth: 1,
  },
  messageText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#161515ff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
