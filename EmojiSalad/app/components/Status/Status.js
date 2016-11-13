import React, { Component } from 'react';
import {
  //Easing,
  View,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';

import * as styles from './styles';

const loadingStates = [
  0,
];

const timeoutDuration = 5000;
const animationDuration = 350;

const animatedValues = [
  //'height',
  //'opacity',
  //'borderBottomWidth',
];

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = animatedValues.reduce((state, key) => ({
      ...state,
      [key]: new Animated.Value(0),
      //[key]: new Animated.Value(styles.status[key]),
    }), {});
  }

  handleAnimations() {
    clearTimeout(this.timeout);

    if (loadingStates.indexOf(this.props.code) !== -1) {
      this.timeout = setTimeout(() => {
        animatedValues.forEach(key => {
          Animated.timing(this.state[key], {
            toValue: 0,
            duration: animationDuration,
          }).start();
        });
      }, timeoutDuration);
    } else {
      this.timeout = setTimeout(() => {
        animatedValues.forEach(key => {
          Animated.timing(this.state[key], {
            toValue: styles.status[key],
            duration: animationDuration,
          }).start();
        });
      }, 0);
    }
  }

  componentDidMount() {
    this.handleAnimations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.handleAnimations();
    }
  }

  render() {
    const {
      loading,
      text,
    } = this.props;

    const styleValues = animatedValues.reduce((state, key) => ({
      ...state,
      [key]: this.state[key],
    }), {});

    const containerStyle = {
      ...styles.status,
      ...styleValues,
    };

    return (
      <Animated.View
        style={{
          ...containerStyle,
        }}
      >
        {loading ? (
          <ActivityIndicator style={styles.spinner} />
          ) : null}
          <Text
            style={{
              ...styles.textStyle,
            }}
          >
            {text}
          </Text>
      </Animated.View>
    );
  }
}
