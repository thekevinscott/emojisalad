import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
//import Spinner from 'react-native-loading-spinner-overlay';
import { Messenger } from '../../../components/Messenger';
//import { Logger } from '../../../components/Logger';
import moment from 'moment';

import {
  View,
} from 'react-native';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

//const MESSAGES_PER_PAGE = 20;

class Game extends Component {
  constructor(props) {
    super(props);
    this.loadEarlier = this.loadEarlier.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentWillAppear() {
    console.log('game component will appear');
    const d = moment();
    this.props.actions.updateLogger(`Game component refreshed: ${d.format('dddd Do h:mm:ss a')}`);
    const {
      game,
      actions,
      me,
      messages,
      seen,
    } = this.props;

    console.log('this props', this.props);

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

    return (
      <View
        style={styles.container}
      >
        <View style={{
          flex: 1,
        }}>
          <Messenger
            handleSend={this.handleSend}
            loadEarlier={this.loadEarlier}
            isLoadingEarlier={this.props.loading}
            updateCompose={this.props.actions.updateCompose}
            compose={compose}
            messages={messages}
            totalMessages={game.totalMessages}
            updated={this.props.updated}
          />
        </View>
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps,
)(Game);
