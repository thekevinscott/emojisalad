import React, { Component } from 'react';

import {
  Platform,
  Text,
  View,
  TextInput,
  Animated,
} from 'react-native';

import * as styles from './styles';

const getToValue = (key, nextProps) => {
  if (nextProps.value !== '') {
    return styles.composerSendViewVisible[key];
  }

  return styles.composerSendView[key];
};

const getAnimation = (key, toValue, state = {}) => {
  return Animated.timing(state[key], {
    toValue,
    duration: styles.animation.duration,
  });
};

export default class Composer extends Component {
  constructor(props) {
    super(props);
    this.animations = new Map();
    this.state = {
      send: {
        ...styles.composerSendView,
        width: new Animated.Value(0),
      },
    };
  }

  stopAnimations() {
    this.animations.forEach(animation => {
      if (animation) {
        animation.stop();
      }
    });
  }

  startAnimations() {
    this.animations.forEach((animation, key) => {
      if (animation) {
        animation.start(() => {
          this.animations.set(key, null);
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.value === '' || nextProps.value === '') &&
      this.props.value !== nextProps.value
    ) {
      this.stopAnimations();

      Object.keys({
        ...styles.composerSendView,
        ...styles.composerSendViewVisible,
      }).forEach(key => {
        const toValue = getToValue(key, nextProps);
        this.animations.set(key, getAnimation(key, toValue, this.state.send));
      });

      this.startAnimations();
    }
  }

  render() {
    const {
      updateCompose,
      handleSend,
      value,
    } = this.props;

    const keyboardType = Platform.select({
      ios: 'twitter',
      android: 'default',
    });

    return (
      <View
        style={styles.composerContainer}
      >
        <TextInput
          keyboardType={keyboardType}

          placeholder="Message"
          multiline={true}
          autoCorrect={false}

          placeholderTextColor={styles.placeholder.color}
          style={styles.composerText}

          onChangeText={updateCompose}
          underlineColorAndroid="transparent"
          value={value}
        />
        <Animated.View
          style={{
            width: this.state.send.width,
            //transform: [{
              //translateY: this.state.send.translateY,
            //}],
          }}
        >
          <Text
            style={styles.composerSend}
            onPress={handleSend}
          >
            Send
          </Text>
        </Animated.View>
      </View>
    );
  }
}
