/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import GiftedMessenger from 'react-native-gifted-messenger';

import * as styles from '../styles';

import {
  fetchMessages,
} from '../actions';

import {
  selectMessages,
} from '../selectors';

import {
  selectMe,
} from '../../App/selectors';

function mapStateToProps(state, ownProps) {
  const game = ownProps.game;

  return {
    game,
    messages: selectMessages(state, game.id),
    me: selectMe(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchMessages: (userId) => {
        return dispatch(fetchMessages(userId));
      },
    },
  };
}

class Game extends Component {
  componentWillMount() {
    this.props.actions.fetchMessages(this.props.me.id);
  }

  render() {
    const {
      game,
    } = this.props;
    //console.log('this props', this.props.messages);
    return (
      <View
        style={styles.container}
      >
        <GiftedMessenger
          styles={{
            bubbleRight: {
              marginLeft: 70,
              backgroundColor: '#007aff',
            },
          }}

          autoFocus={false}
          messages={this.props.messages.map(message => ({
            text: message.body,
            uniqueId: message.id,
            name: 'React-Bot',
            image: (message.type === 'received') ? null : {
              uri: 'https://facebook.github.io/react/img/logo_og.png',
            },
            position: (message.type === 'received') ? 'right' : 'left',
          }))}
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
