import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export async function save(key: string, value: string) {
  if (Platform.OS !== 'web') {
    await SecureStore.setItemAsync(key, value);
  } else {
    // Implement web storage solution, like localStorage
    localStorage.setItem(key, value);
  }
}

export async function getValueFor(key: string) {
  if (Platform.OS !== 'web') {
    let result = await SecureStore.getItemAsync(key);
    return result;
  } else {
    // Retrieve from web storage
    return localStorage.getItem(key);
  }
}

export async function deleteItemAsync(key: string) {
  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(key);
  } else {
    // Implement web storage solution, like localStorage
    localStorage.removeItem(key);
  }
}
