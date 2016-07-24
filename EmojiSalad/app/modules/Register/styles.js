import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 0,
    margin: 0,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    fontSize: 20,
    backgroundColor: '#AAA',
    padding: 20,
  },
});

export default styles;

export const inputStyle = {
  height: 40,
  textAlign: 'center',
  backgroundColor: '#CCC',
  margin: 10,
  color: '#000',
};

export const errorStyle = {
  textAlign: 'center',
  backgroundColor: 'red',
  margin: 10,
  color: '#FFF',
  padding: 20,
};
