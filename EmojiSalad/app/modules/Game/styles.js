import {
  Platform,
} from 'react-native';

export const container = {
  paddingTop: Platform.select({
    ios: 64,
    android: 54,
  }),
  flex: 1,
};

export const row = {
  backgroundColor: '#CCC',
  padding: 20,
  justifyContent: 'center',
};
