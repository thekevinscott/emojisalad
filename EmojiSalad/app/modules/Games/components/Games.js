/**
 * @flow
 */

import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
//import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { Logger } from '../../../components/Logger';
import {
  //Text,
  View,
  TouchableHighlight,
  ListView,
  PushNotificationIOS,
} from 'react-native';
import Messages from './Messages';
import RowHeader from './RowHeader';

import * as styles from '../styles';

import {
  fetchGames,
  openGame,
  updateStartingMessage,
} from '../actions';

import {
  selectGamesByNewestFirst,
  selectUI,
} from '../selectors';

import {
  selectMe,
} from '../../App/selectors';

function mapStateToProps(state) {
  const loggerMessages = state.ui.Logger.messages;

  return {
    games: selectGamesByNewestFirst(state),
    me: selectMe(state),
    ui: selectUI(state),
    logger: loggerMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchGames: (userKey) => {
        return dispatch(fetchGames(userKey));
      },
      openGame: (game, games) => {
        return dispatch(openGame(game, games));
      },
      updateStartingMessage: game => {
        return dispatch(updateStartingMessage(game));
      },
    },
  };
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

class Games extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.onRegister = this.onRegister.bind(this);
  }

  componentDidMount() {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', this.onRegister);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegister);
  }

  onRegister(token) {
    console.log('register callback!');
    console.log('the token', token);
  }

  componentWillAppear() {
    console.log('Games Overview Component componentWillAppear called');
    this.props.actions.fetchGames(this.props.me.key);
  }

  renderRow(game, sectionId, rowId) {
    //const message = (game.messages[game.messages.length - 1] || {});
    const messages = game.messages;
    const mostRecentMessage = messages[messages.length - 1] || {};
    const unreadDotStyle = {
      ...styles.unreadDot,
      opacity: (mostRecentMessage.key !== game.lastRead) ? 1 : 0,
    };
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.actions.openGame(game, this.props.games);
        }}
        key={`${rowId}`}
      >
        <View style={styles.rowContainer}>
          <View
            style={styles.unread}
          >
            <View style={unreadDotStyle} />
          </View>
          <View
            style={styles.game}
          >
            <Messages
              messages={messages}
              game={game}
              updateStartingMessage={this.props.actions.updateStartingMessage}
            />
            <RowHeader
              players={game.players}
              timestamp={mostRecentMessage.timestamp}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={styles.rowSeparator(adjacentRowHighlighted)}
      />
    );
  }

  getGames() {
    return ds.cloneWithRows(this.props.games);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.props.ui.fetching && !this.props.games.length} />
        <ListView
          dataSource={this.getGames()}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeperator}
          style={styles.container}
          enableEmptySections={true}
        />
        <Logger logger={this.props.logger} />
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps
)(Games);
