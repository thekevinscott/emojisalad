import React, { Component } from 'react';

import {
  Text,
  View,
  TextInput,
  LayoutAnimation,
} from 'react-native';

import * as styles from './styles';

const CustomLayout = {
  duration: styles.animation.duration,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

export default class Composer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: styles.composerSendView,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.value === '' || nextProps.value === '') &&
      this.props.value !== nextProps.value
    ) {
      LayoutAnimation.configureNext(CustomLayout);
      this.setState({
        style: nextProps.value === '' ? {
          ...styles.composerSendView,
        } : styles.composerSendViewVisible,
      });
    }
  }

  render() {
    const {
      updateCompose,
      handleSend,
      value,
    } = this.props;

    return (
      <View
        style={styles.composerContainer}
      >
        <TextInput
          placeholder="Message"
          multiline={true}
          autoCorrect={false}

          placeholderTextColor={styles.placeholder.color}
          style={styles.composerText}

          onChangeText={updateCompose}
          underlineColorAndroid="transparent"
          value={value}
        />
        <View
          style={[
            this.state.style,
          ]}
        >
          <Text
            style={styles.composerSend}
            onPress={handleSend}
          >
            Send
          </Text>
        </View>
      </View>
    );
  }
}
