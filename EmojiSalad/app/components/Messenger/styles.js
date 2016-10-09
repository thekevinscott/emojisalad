import {
  Platform,
} from 'react-native';

const PURPLE = '#bb27dd';

export const receivedMessage = {
  marginLeft: -40,
  backgroundColor: '#d8d8d8',
};

export const sentMessage = {
  //backgroundColor: '#007aff',
  backgroundColor: PURPLE,
};

export const pendingMessage = {
  backgroundColor: 'green',
};

export const placeholder = {
  color: '#bbbbbb',
};

export const composerContainer = {
  backgroundColor: '#eeeeee',
  padding: 5,
  flex: 1,
  height: Platform.select({
    ios: 44,
    android: 33,
  }),
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: '#cccccc',
  borderBottomWidth: 0,
  justifyContent: 'center',
  alignItems: 'center',
};

export const composerText = {
  borderColor: '#cccccc',
  backgroundColor: 'white',
  borderRadius: 5,
  borderWidth: 1,
  paddingTop: 2,
  paddingBottom: 5,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: 16,
  lineHeight: 16,
  flex: 1,
};

export const composerSend = {
  marginLeft: 8,
  marginRight: 2,
  fontWeight: 'bold',
  textDecorationLine: 'underline',
  color: PURPLE,
};

export const composerSendView = {
  width: 0,
};

export const composerSendViewVisible = {
  width: 50,
};

export const animation = {
  duration: 150,
};
