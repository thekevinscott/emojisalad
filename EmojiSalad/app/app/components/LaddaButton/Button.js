import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Easing,
  //LayoutAnimation,
  Animated,
} from 'react-native';

import Spinner from './Spinner';

import {
  BUTTON,
  ANIMATION,
  styles,
} from './styles';

const getToValue = (isLoading, key) => {
  if (key === 'width' || key === 'borderRadius') {
    const KEYS = {
      width: 'WIDTH',
      borderRadius: 'BORDER_RADIUS',
    };

    return isLoading ? BUTTON[KEYS[key]].LOADING : BUTTON[KEYS[key]].REST;
  }

  const containerWidth = isLoading ? BUTTON.WIDTH.LOADING : BUTTON.WIDTH.REST;
  return (containerWidth / 2) - (styles.spinner.width / 2);
};

export default class LaddaButton extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.animations = new Map();

    const width = props.isLoading ? BUTTON.WIDTH.LOADING : BUTTON.WIDTH.REST;

    this.state = {
      //style: props.isLoading ? loadingState() : originalState(),
      width: new Animated.Value(width),
      borderRadius: new Animated.Value(props.isLoading ? BUTTON.BORDER_RADIUS.LOADING : BUTTON.BORDER_RADIUS.REST),
      spinnerLeft: new Animated.Value((width / 2) - (styles.spinner.width / 2)),
    };
  }

  stopAnimations() {
    this.animations.forEach(animation => {
      if (animation && animation.stop) {
        animation.stop();
      }
    });
  }

  startAnimations() {
    this.animations.forEach((animation, key) => {
      if (animation && animation.start) {
        animation.start(() => {
          this.animations.set(key, null);
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading !== nextProps.isLoading) {
      this.stopAnimations();
      [
        'width',
        'spinnerLeft',
        'borderRadius',
      ].forEach(key => {
        const toValue = getToValue(nextProps.isLoading, key);
        this.animations.set(key, Animated.timing(this.state[key], {
          toValue,
          duration: ANIMATION.DURATION,
          easing: Easing.elastic(1),
        }));
      });
      this.startAnimations();
    }
  }

  onPress() {
    this.props.onLoadEarlier();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View
          style={{
            ...styles.box,
            width: this.state.width,
            borderRadius: this.state.borderRadius,
            justifyContent: this.props.isLoading ? 'flex-start' : 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.onPress}
            style={{
              //...this.state.style,
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
              left={this.state.spinnerLeft}
              isLoading={this.props.isLoading}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}
