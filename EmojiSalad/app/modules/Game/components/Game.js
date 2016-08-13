import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
import Spinner from 'react-native-loading-spinner-overlay';
import { Messenger } from '../../../components/Messenger';
//import { Logger } from '../../../components/Logger';

import {
  View,
} from 'react-native';

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


  render() {
    const {
      messages,
      game,
      //logger,
      compose,
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
          {!loading ? (
            <Messenger
              handleSend={this.handleSend}
              loadEarlier={this.loadEarlier}
              isLoadingEarlier={this.props.isLoadingEarlier}
              updateCompose={this.props.actions.updateCompose}
              compose={compose}
              messages={messages}
              totalMessages={game.totalMessages}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
