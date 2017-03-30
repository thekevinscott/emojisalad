/**
 * @flow
 */

import React, { Component } from 'react';
import {
  Animated,
  View,
} from 'react-native';

import Message from './Message';

import * as styles from '../styles';

import {
  //getMessagesAsArray,
  messagesShouldAnimate,
  getTargetHeight,
} from '../utils';

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: new Animated.Value(0),
      messages: {},
      mounted: false,
      props: {
        prev: { messages: [] },
        current: { messages: [] },
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      props: {
        prev: this.props,
        current: nextProps,
      },
    });
  }

  componentShouldAnimate() {
    if (messagesShouldAnimate(this.state.props, this.state.messages)) {
      if (this.animation) {
        this.animation.stop();
      }

      const toValue = getTargetHeight(this.state.props.current.messages, this.state.messages);
      const duration = this.state.props.current.messages.length > 1 ? styles.MESSAGE_SLIDE_DURATION : 0;
      this.animation = Animated.timing(this.state.top, {
        toValue,
        duration,
      });

      this.animation.start(() => {
        this.props.updateStartingMessage(this.props.game);
        delete this.animation;
      });
    }
  }

  componentDidUpdate() {
    this.componentShouldAnimate();
  }

  componentDidMount() {
    this.setState({
      mounted: true,
    });
  }

  render() {
    const {
      messages,
    } = this.props;

    return (
      <Animated.View
        style={{
          ...styles.messagesContainer,
          transform: [{
            translateY: this.state.top,
          }],
        }}
      >
        {messages.map((message, key) => (
          <Message
            key={key}
            shouldFadeIn={!this.state.mounted}
            handleLayoutChange={e => {
              //console.log('layout change for', message.body, 'key', key);
              const newState = {
                messages: {
                  ...this.state.messages,
                  [message.key]: {
                    index: key,
                    body: message.body,
                    layout: e.nativeEvent.layout,
                  },
                },
              };
              this.setState(newState);
              this.componentShouldAnimate();
              //console.log(newState.messageLayouts);
            }}
            body={message.body}
          />
        ))}
      </Animated.View>
    );
  }
}

