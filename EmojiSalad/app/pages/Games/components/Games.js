/**
 * @flow
 */

import React, { Component } from 'react';
import connectWithFocus from '../../../utils/connectWithFocus';
//import { connect } from 'react-redux';
//import Spinner from 'react-native-loading-spinner-overlay';
//import { Logger } from '../../../components/Logger';

import {
  Text,
  ActivityIndicator,
  View,
  TouchableHighlight,
  ListView,
  PushNotificationIOS,
} from 'react-native';
import Messages from './Messages';
import RowHeader from './RowHeader';

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

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
    this.props.actions.updateDeviceToken(token);
  }

  componentWillAppear({ type }) {
    console.log('Games Overview Component componentWillAppear called', type);
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

  getContent() {
    if (this.props.games.length) {
      return (
        <ListView
          dataSource={this.getGames()}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeperator}
          style={styles.container}
          enableEmptySections={true}
        />
      );
    }

    return (
      <View
        style={{
          paddingTop: 80,
        }}
      >
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <ActivityIndicator style={{
            marginRight: 10,
          }} />
          <Text>Loading Games</Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View
        style={styles.games}
      >
        {this.getContent()}
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps
)(Games);
