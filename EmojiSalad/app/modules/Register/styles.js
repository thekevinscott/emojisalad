//import {
  //StyleSheet,
//} from 'react-native';
import {
  constants,
} from '../App/styles';

const textContainerMargin = 50;

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  textContainer: {
    marginTop: 90,
    marginLeft: textContainerMargin,
    marginRight: textContainerMargin,
  },
  header: {
    color: constants.purple,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    backgroundColor: constants.purple,
    alignItems: 'center',
    padding: 20,
    alignSelf: 'stretch',
    height: 350,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    fontSize: 20,
    backgroundColor: '#AAA',
    padding: 20,
  },
  input: {
    height: 40,
    textAlign: 'center',
    fontSize: 20,
    color: constants.purple,
  },
};

export default styles;
