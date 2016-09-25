import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';

import Spinner from './Spinner';

import {
  BUTTON,
  ANIMATION,
  styles,
} from './styles';

const originalState = () => ({
  borderRadius: BUTTON.BORDER_RADIUS.REST,
  width: BUTTON.WIDTH.REST,
});

const loadingState = () => ({
  width: BUTTON.WIDTH.LOADING,
  borderRadius: BUTTON.BORDER_RADIUS.LOADING,
});

const CustomLayoutSpring = {
  duration: ANIMATION.DURATION,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: ANIMATION.DAMPING,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: ANIMATION.DAMPING,
  },
};

export default class LaddaButton extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.state = {
      style: originalState(),
    };
    LayoutAnimation.configureNext(CustomLayoutSpring);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading) {
      LayoutAnimation.configureNext(CustomLayoutSpring);
      this.setState({
        style: nextProps.isLoading ? loadingState() : originalState(),
      });
    }
  }

  onPress() {
    this.props.onLoadEarlier();
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={this.onPress}
          style={{
            ...styles.box,
            ...this.state.style,
          }}
          {...this.props}
        >
          <Text
            numberOfLines={2}
            style={{
              ...styles.text,
              opacity: this.props.isLoading ? 0 : 1,
            }}
          >
            {this.props.children}
          </Text>
          <Spinner
            containerWidth={this.state.style.width}
            isLoading={this.props.isLoading}
          />
        </TouchableOpacity>
      </View>

    );
  }
}
