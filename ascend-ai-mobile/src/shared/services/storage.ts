/* eslint-disable @typescript-eslint/no-require-imports */
import { Platform } from 'react-native';

interface StorageInterface {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  clearAll: () => void;
}

let storageInstance: StorageInterface;

if (Platform.OS === 'web') {
  storageInstance = {
    getString: (key: string) => {
      try {
        const val = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
        return val !== null ? val : undefined;
      } catch (_err) {
        return undefined;
      }
    },
    set: (key: string, value: string) => {
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      } catch (_err) {
        // ignore storage errors
      }
    },
    remove: (key: string) => {
      try {
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      } catch (_err) {
        // ignore storage errors
      }
    },
    clearAll: () => {
      try {
        if (typeof window !== 'undefined') window.localStorage.clear();
      } catch (_err) {
        // ignore storage errors
      }
    },
  };
} else {
  const { createMMKV } = require('react-native-mmkv');
  const mmkv = createMMKV();
  storageInstance = {
    getString: (key: string) => mmkv.getString(key),
    set: (key: string, value: string) => mmkv.set(key, value),
    remove: (key: string) => mmkv.remove(key),
    clearAll: () => mmkv.clearAll(),
  };
}

export const storage = storageInstance;
export default storage;
