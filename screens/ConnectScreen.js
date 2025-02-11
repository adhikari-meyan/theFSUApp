import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

const WifiLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem('username');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedUsername) setUsername(savedUsername);
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('password', password);
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const handleConnect = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        mode: '191',
        username,
        password,
        a: Date.now(),
        producttype: 'none'
      };

      const response = await axios.post('https://10.100.1.1:8090/login.xml', payload, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://10.100.1.1:8090/'
        },
        timeout: 10000
      });

      if (response.status === 200) {
        if (response.data.includes('You are signed in as')) {
          await saveCredentials();
          Alert.alert('Success', 'Successfully connected to WiFi!');
        } else {
          Alert.alert('Error', 'Invalid credentials or maximum login limit reached');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect. Please check your WiFi connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Icon name="wifi" size={40} color="#1a73e8" style={styles.wifiIcon} />
        <Text style={styles.title}>Campus WiFi Login</Text>
        <Text style={styles.subtitle}>
          Please connect to campus WiFi network before proceeding
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username (Roll No.)"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { paddingRight: 50 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="wifi" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Connect</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wifiIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a73e8',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  connectButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WifiLoginScreen;