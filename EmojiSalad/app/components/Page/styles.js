import {
  Platform,
} from 'react-native';

const header = Platform.select({
  ios: 64,
  android: 33,
});

const styles = {
  page: {
    marginTop: header,
    flex: 1,
  },
};

export default styles;
