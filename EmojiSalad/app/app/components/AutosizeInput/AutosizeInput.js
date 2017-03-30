import React, { Component } from 'react';

import {
  //Platform,
  Text,
  View,
  TextInput,
  //Animated,
} from 'react-native';

const minimumTextHeight = 33;
const paddingForContainer = 44 - minimumTextHeight;

const getHeight = height => {
  console.log('incoming height', height);
  if (height < minimumTextHeight) {
    return minimumTextHeight;
  }

  if (height > 205) {
    return 205;
  }

  return height;
};

export default class AutosizeInput extends Component {
  constructor(props) {
    super(props);
    this.onHiddenLayout = this.onHiddenLayout.bind(this);
    this.animations = new Map();
    this.state = {
      height: minimumTextHeight,
      width: 0,
    };
  }

  onHiddenLayout(event) {
    //console.log('proportions', event.nativeEvent.layout.width, event.nativeEvent.layout.height);

    const height = getHeight(event.nativeEvent.layout.height);

    if (this.state.height !== height) {
      if (this.props.onLayoutChange) {
        this.props.onLayoutChange(height);
      }

      this.setState({
        height,
      });
    }
  }

  componentDidUpdate() {
    if (this.refs.textInput) {
      this.refs.textInput.measure((ox, oy, width) => {
        this.setState({
          width,
        });
      });
    }
  }

  render() {
    const {
      value,
      composerTextContainer,
    } = this.props;

    return (
      <View
        style={{
          ...composerTextContainer,
        }}
      >
        <Text
          onLayout={this.onHiddenLayout}
          style={{
            position: 'absolute',
            top: 100000,
            left: 100000,
            width: this.state.width,
          }}
        >
          {value}
        </Text>
        <TextInput
          ref="textInput"
          multiline={true}
          {...this.props}
          style={{
            ...this.props.style,
            height: this.state.height,
          }}
        />
      </View>
    );
  }
}
