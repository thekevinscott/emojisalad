import React, { Component } from 'react';
import {
  Text,
  Animated,
} from 'react-native';

import {
  message as messageStyle,
  MESSAGE_FADEIN_DURATION,
} from '../styles';

export default class Message extends Component {
  constructor(props) {
    super(props);
    const value = this.props.shouldFadeIn ? 0 : 1;
    this.state = {
      opacity: new Animated.Value(value),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: MESSAGE_FADEIN_DURATION,
    }).start();
  }

  render() {
    const {
      body,
      handleLayoutChange,
    } = this.props;

    return (
      <Animated.Text
        style={{
          ...messageStyle,
          opacity: this.state.opacity,
        }}
        numberOfLines={2}
        onLayout={handleLayoutChange}
      >
        {body}
      </Animated.Text>
    );
  }
}
