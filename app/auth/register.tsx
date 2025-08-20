// app/auth/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../src/graphql/loginQueries';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const router = useRouter();
  const [register, { loading }] = useMutation(REGISTER_MUTATION);

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 5000);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      showMessage('Please enter your name', 'error');
      return false;
    }
    if (!email.trim()) {
      showMessage('Please enter your email', 'error');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      showMessage('Please enter a valid email address', 'error');
      return false;
    }
    if (!password) {
      showMessage('Please enter a password', 'error');
      return false;
    }
    if (password.length < 6) {
      showMessage('Password must be at least 6 characters long', 'error');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    console.log('Registration attempt started');
    setMessage('');

    if (!validateInputs()) {
      return;
    }

    showMessage('Creating your account...', 'info');

    try {
      console.log('Sending registration request...', { email, name });
      
      const { data } = await register({
        variables: {
          input: { email, password, name }
        }
      });

      console.log('Registration response:', data);

      if (data?.register?.token) {
        showMessage('Account created successfully!', 'success');
        
        Alert.alert(
          'Success', 
          'Account created successfully! Please login with your credentials.',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Navigating to login...');
                router.replace('/auth/login');
              }
            }
          ]
        );
      } else {
        console.log('Registration failed - no token received');
        showMessage('Registration failed - please try again', 'error');
        Alert.alert('Registration Failed', 'No token received from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Failed to register. Please try again.';
      showMessage(errorMessage, 'error');
      Alert.alert('Registration Error', errorMessage);
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
      <Text style={styles.title}>Create Account</Text>
      
      {message && (
  <View style={[styles.messageContainer, getMessageStyle(messageType)]}>
    <Text style={styles.messageText}>{message}</Text>
  </View>
)}
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setMessage('');
        }}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setMessage('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setMessage('');
        }}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={[styles.buttonText, { marginLeft: 8 }]}>Creating Account...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => router.replace('/auth/login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Use the same styles as login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#ddd',
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
