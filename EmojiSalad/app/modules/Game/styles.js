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

export const rowText = {
};

export const receivedMessage = {
  marginLeft: -40,
  backgroundColor: '#d8d8d8',
};

export const sentMessage = {
  //backgroundColor: '#007aff',
  backgroundColor: '#bb27dd',
};

export const placeholder = {
  color: '#bbbbbb',
};

export const composer = {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
  lineHeight: 16,
  marginTop: Platform.select({
    ios: 6,
    android: 0,
  }),
  marginBottom: Platform.select({
    ios: 5,
    android: 3,
  }),
  height: Platform.select({
    ios: 33,
    android: 41,
  }), // TODO SHARE with GiftedChat.js and tests
};
