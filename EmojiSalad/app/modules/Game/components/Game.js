/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  //Text,
  View,
} from 'react-native';

import GiftedMessenger from 'react-native-gifted-messenger';

import * as styles from '../styles';

import {
  //fetchMessages,
} from '../actions';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Game extends Component {
  componentWillMount() {
    //this.props.actions.fetchMessages(this.props.me.id);
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <GiftedMessenger
          styles={{
            bubbleRight: styles.myMessage,
          }}

          autoFocus={false}
          messages={this.props.messages.map(message => {
            //console.log(message);
            return {
              text: message.body,
              uniqueId: message.key,
              name: 'React-Bot',
              //image: (message.type === 'received') ? null : {
                //uri: 'https://facebook.github.io/react/img/logo_og.png',
              //},
              position: (message.type === 'received') ? 'right' : 'left',
            };
          })}
          parseText={true}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
