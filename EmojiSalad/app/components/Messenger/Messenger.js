import React, { Component } from 'react';

import {
  GiftedChat,
} from 'react-native-gifted-chat';

import {
  Message,
  Composer,
  LoadEarlier,
} from './';

export default class Messenger extends Component {
  constructor(props) {
    super(props);
    this.parseMessages = this.parseMessages.bind(this);
  }

  parseMessages(messages) {
    return messages.map((message) => ({
      text: message.body,
      _id: message.key,
      position: (message.type === 'received') ? 'right' : 'left',
      createdAt: new Date(message.timestamp),
      user: { _id: message.type },
    }));
  }

  render() {
    // this tells gifted chat whether a message is from
    // us or from them
    const user = {
      _id: 'received',
    };

    return (
      <GiftedChat
        isAnimated={true}
        loadEarlier={this.props.messages.length < this.props.totalMessages}
        isLoadingEarlier={this.props.isLoadingEarlier}
        renderLoadEarlier={() => (
          <LoadEarlier
            handleLoadEarlier={this.props.loadEarlier}
            isLoading={this.props.isLoadingEarlier}
          />
        )}
        renderBubble={props => (
          <Message {...props} />
        )}
        user={user}
        renderComposer={() => (
          <Composer
            updateCompose={this.props.updateCompose}
            handleSend={this.props.handleSend}
            value={this.props.compose}
          />
        )}
        messages={this.parseMessages(this.props.messages)}
      />
    );
  }
}
