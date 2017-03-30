import React, { Component } from 'react';

import {
  GiftedChat,
} from 'react-native-gifted-chat';

import {
  Message,
  Composer,
  LoadEarlier,
} from './';

const getMessagePosition = type => {
  return (type === 'received' || type === 'pending') ? 'right' : 'left';
};

export default class Messenger extends Component {
  constructor(props) {
    super(props);
    this.parseMessages = this.parseMessages.bind(this);
  }

  parseMessages(messages) {
    return messages.map(({
      type,
      key,
      body,
      timestamp,
    }) => {
      const position = getMessagePosition(type);

      return {
        type,
        text: body,
        _id: key,
        position,
        createdAt: new Date(timestamp),
        user: { _id: position },
      };
    });
  }

  render() {
    // this tells gifted chat whether a message is from
    // us or from them
    const user = {
      _id: 'right',
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
            updated={this.props.updated}
          />
        )}
        renderBubble={props => (
          <Message {...props} />
        )}
        user={user}
        renderComposer={() => {
          return (
            <Composer
              updateCompose={this.props.updateCompose}
              handleSend={this.props.handleSend}
              value={this.props.compose}
            />
          );
        }}
        messages={this.parseMessages(this.props.messages)}
      />
    );
  }
}
