import {
  Platform,
} from 'react-native';

export const HEADER_HEIGHT = Platform.select({
  ios: 64,
  android: 54,
});
