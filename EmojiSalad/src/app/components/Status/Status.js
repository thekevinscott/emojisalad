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

const timeoutDuration = 3500;
const animationDuration = 350;

const animatedValues = {
  height: {
    defaultVal: 0,
    css: 'status',
  },
  opacity: {
    defaultVal: 0,
    css: 'status',
  },
  //backgroundColor: {
    //defaultVal: 'rgb(255, 0, 0)',
    //css: 'status',
  //},
};

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = Object.keys(animatedValues).reduce((state, key) => ({
      ...state,
      [key]: new Animated.Value(0),
    }), {});
  }

  handleAnimations() {
    clearTimeout(this.timeout);

    if (loadingStates.indexOf(this.props.code) !== -1) {
      this.timeout = setTimeout(() => {
        Object.keys(animatedValues).forEach(key => {
          //console.log('free bird', animatedValues[key]);
          Animated.timing(this.state[key], {
            toValue: 0,
            duration: animationDuration,
          }).start();
        });
      }, timeoutDuration);
    } else {
      this.timeout = setTimeout(() => {
        Object.keys(animatedValues).forEach(key => {
          Animated.timing(this.state[key], {
            toValue: 1,
            //toValue: styles.status[key],
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

    const styleValues = Object.keys(animatedValues).reduce((state, key) => {
      const {
        defaultVal,
        css,
      } = animatedValues[key];
      if (!defaultVal === undefined) {
        throw new Error(`You must provide a default val for ${key}`);
      }
      if (!css === undefined) {
        throw new Error(`You must provide a css for ${key}`);
      }

      return {
        ...state,
        [key]: this.state[key].interpolate({
          inputRange: [0, 1],
          outputRange: [defaultVal, styles[css][key]],
        }),
      };
    }, {});

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
