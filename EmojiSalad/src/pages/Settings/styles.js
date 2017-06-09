import {
  Platform,
} from 'react-native';

export const container = {
  flex: 1,
  marginTop: Platform.select({
    ios: 64,
    android: 33,
  }),
};

export const logout = {
  height: 75,
  marginLeft: 20,
  marginTop: 20,
};

export const logoutText = {
  fontSize: 20,
  color: 'blue',
};

export const avatar = {
  fontSize: 90,
  height: 90,
  textAlign: 'center',
};

export const pickEmoji = {
  fontSize: 12,
};
