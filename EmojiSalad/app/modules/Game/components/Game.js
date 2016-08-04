/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  //Text,
  TextInput,
  View,
  AppState,
} from 'react-native';

import { Logger } from '../../../components/Logger';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import * as styles from '../styles';

import {
  makeMapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Game extends Component {
  constructor(props) {
    super(props);
    this.loadEarlier = this.loadEarlier.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.state = {
    };
  }

  componentWillMount() {
    //this.props.actions.fetchMessages(this.props.me.key, this.props.game.key, this.props.game.messages);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  _handleAppStateChange(currentAppState) {
    console.log('current app state', currentAppState);
  }

  loadEarlier() {
    this.props.actions.fetchMessages(this.props.me.key, this.props.game.key, this.props.game.messages);
    this.props.actions.incrementPage(this.props.game.key);
  }

  handleSend() {
    this.props.actions.sendMessage(this.props.me.key, {
      body: this.props.compose,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.receivedMessage,
          right: styles.sentMessage,
        }}
      />
    );
  }

  renderComposer() {
    return (
      <TextInput
        placeholder="Message"
        placeholderTextColor={styles.placeholder.color}
        multiline={false}
        style={styles.composer}
        onChangeText={this.props.actions.updateCompose}
        underlineColorAndroid="transparent"
        onSubmitEditing={this.handleSend}
        value={this.props.compose}
      />
    );
  }

  renderMessenger() {
    //console.log('laod earlier', this.props.messages.length, this.props.game.totalMessages);
    return (
      <GiftedChat
        isAnimated={true}
        styles={{
          backgroundColor: 'blue',
        }}
        isAnimated={true}
        loadEarlier={this.props.messages.length < this.props.game.totalMessages}
        onLoadEarlier={this.loadEarlier}
        renderBubble={this.renderBubble}
        user={{
          _id: 1,
        }}
        renderComposer={this.renderComposer}
        messages={this.props.messages.map((message) => {
          const user = {
            _id: (message.type === 'received') ? 1 : 2,
          };
          const payload = {
            text: message.body,
            _id: message.key,
            position: (message.type === 'received') ? 'right' : 'left',
            createdAt: new Date(message.timestamp),
            user,
          };
          //console.log('payload', payload);
          return payload;
        })}
      />
    );
  }

  render() {
    const logger = this.props.logger;
    //console.log('render Game');
    return (
      <View
        style={styles.container}
      >
        <View style={{
          flex: 1,
        }}>
          {this.renderMessenger()}
          <Logger logger={logger} />
        </View>
      </View>
    );
  }
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Game);
