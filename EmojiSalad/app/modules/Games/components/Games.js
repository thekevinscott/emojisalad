/**
 * @flow
 */

import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
//import { connect } from 'react-redux';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { Logger } from '../../../components/Logger';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as styles from '../styles';

import {
  fetchGames,
} from '../actions';

import {
  selectGamesByNewestFirst,
  selectUI,
} from '../selectors';

import {
  selectMe,
} from '../../App/selectors';

function mapStateToProps(state) {
  return {
    games: selectGamesByNewestFirst(state),
    me: selectMe(state),
    ui: selectUI(state),
    logger: state.ui.Games.logger,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchGames: (userKey) => {
        return dispatch(fetchGames(userKey));
      },
    },
  };
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

function getPlayerString(players) {
  const playerString = players.map(player => `${player.nickname}`).join(', ');

  const characterLimit = 30;

  if (playerString.length > characterLimit) {
    return `${playerString.substring(0, characterLimit - 3)}...`;
  }
  return playerString;
}

function parseTimestamp(timestamp) {
  const date = moment(timestamp);
  return date.fromNow();
}

class Games extends Component {
  componentWillAppear() {
    console.log('Games Overview Component componentWillAppear called');
    this.props.actions.fetchGames(this.props.me.key);
  }

  _renderRow(game, sectionId, rowId) {
    //const message = (game.messages[game.messages.length - 1] || {});
    const message = game.messages[0] || {};
    const unreadDotStyle = {
      ...styles.unreadDot,
      opacity: (message.key !== game.lastRead) ? 1 : 0,
    };
    return (
      <TouchableHighlight
        onPress={() => {
          Actions.game({
            game,
          });
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
            style={styles.row}
          >
            <View style={styles.rowHeader}>
              <Text
                style={
                  styles.players
                }
                numberOfLines={1}
              >
                {getPlayerString(game.players)}
              </Text>
              <Text style={styles.timestamp}>
                {parseTimestamp(message.timestamp)}
              </Text>
            </View>
            <Text
              style={styles.message}
              numberOfLines={2}
            >
              {message.body}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
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
          renderRow={this._renderRow}
          renderSeparator={this._renderSeperator}
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
