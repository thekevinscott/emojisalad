/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  //Text,
  View,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

import * as styles from '../styles';

import {
  //fetchMessages,
} from '../actions';

import {
  makeMapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Game extends Component {
  constructor(props) {
    super(props);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);
    this.state = {
      loadEarlier: true,
    };
  }

  componentWillMount() {
    //this.props.actions.fetchMessages(this.props.me.id);
  }

  onLoadEarlier() {
    console.log('load the earlier ones');
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <GiftedChat
          styles={{
            bubbleRight: styles.myMessage,
          }}
          isAnimated={true}
          loadEarlier={this.state.loadEarlier}
          onLoadEarlier={this.onLoadEarlier}
          messages={this.props.messages.slice(0, 1).map(message => {
            return {
              text: message.body,
              uniqueId: message.key,
              //name: 'React-Bot',
              //image: (message.type === 'received') ? null : {
                //uri: 'https://facebook.github.io/react/img/logo_og.png',
              //},
              position: (message.type === 'received') ? 'right' : 'left',
            };
          })}
        />
      </View>
    );
  }
}

export default connect(
  makeMapStateToProps,
  mapDispatchToProps
)(Game);
