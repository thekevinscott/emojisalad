/**
 * @flow
 */

import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
import Spinner from 'react-native-loading-spinner-overlay';
import { Logger } from '../../../components/Logger';
import {
  //Text,
  TextInput,
  View,
} from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

const MESSAGES_PER_PAGE = 20;

class Game extends Component {
  constructor(props) {
    super(props);
    this.loadEarlier = this.loadEarlier.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderComposer = this.renderComposer.bind(this);
    this.state = {};
  }

  componentWillAppear() {
    const {
      game,
      actions,
      me,
      messages,
      seen,
    } = this.props;

    actions.fetchLatestMessages(me.key, game.key, {
      messages,
      seen,
    });
  }

  loadEarlier() {
    const {
      game,
      actions,
      me,
      seen,
    } = this.props;

    actions.fetchMessagesBeforeFirst(me.key, game.key, {
      seen,
    });
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
        autoCorrect={false}
        style={styles.composer}
        onChangeText={this.props.actions.updateCompose}
        underlineColorAndroid="transparent"
        onSubmitEditing={this.handleSend}
        value={this.props.compose}
      />
    );
  }

  renderMessenger() {
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
          return payload;
        })}
      />
    );
  }

  render() {
    const {
      messages,
      game,
      logger,
    } = this.props;
    const loading = messages.length < MESSAGES_PER_PAGE && game.messages.length !== game.totalMessages;
    return (
      <View
        style={styles.container}
      >
        <View style={{
          flex: 1,
        }}>
          <Spinner
            visible={loading}
          />
          {!loading ? this.renderMessenger() : null}
          <Logger logger={logger} />
        </View>
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
