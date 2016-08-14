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

//const messagesMatch = (oldMessages, newMessages) => {
  //if (oldMessages.length !== newMessages.length) {
    //return false;
  //}

  //return oldMessages.filter((message, index) => {
    //return message.key !== newMessages[index].key;
  //}).length;
//};

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: new Animated.Value(styles.rowContainer.height - styles.messagesContainer.top),
    };
  }

  //componentWillReceiveProps({ messages }) {
    //if (!messagesMatch(this.props.messages, messages)) {
      //console.log('do it');
      //LayoutAnimation.configureNext(CustomLayout);
      //this.setState({
        //style: {
          //top: 0,
          //backgroundColor: 'red',
        //},
      //});
    //}
  //}

  componentDidMount() {
    this.state.top.setValue(styles.rowContainer.height - styles.messagesContainer.top);
    this.state.top.setValue(0);
    Animated.spring(this.state.top, {
      toValue: 0,
      friction: 1,
    }).start();
  }

  render() {
    const {
      messages,
    } = this.props;

    console.log('this state top', this.state.top._value);

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
            body={message.body}
          />
        ))}
      </Animated.View>
    );
  }
}

