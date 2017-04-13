/**
 * @flow
 */

import React from 'react';

import {
  Text,
  ActivityIndicator,
  View,
  TouchableHighlight,
  //ListView,
  //RefreshControl,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import Messages from './Messages';
import RowHeader from './RowHeader';

import * as styles from '../styles';

const renderSeperator = (sectionID, rowID, adjacentRowHighlighted) => {
  return (
    <View
      key={`${sectionID}-${rowID}`}
      style={styles.rowSeparator(adjacentRowHighlighted)}
    />
  );
};

const getUnreadStyle = ({ isUnread }) => ({
  ...styles.unreadDot,
  opacity: isUnread ? 1 : 0,
});

const renderRow = ({
  openGame,
  games,
  updateStartingMessage,
}) => (game, sectionId, rowId) => {
  const messages = game.messages;
  const mostRecentMessage = messages[messages.length - 1] || {};

  const unreadDotStyle = getUnreadStyle(game);

  return (
    <TouchableHighlight
      onPress={() => {
        openGame(game, games);
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
            updateStartingMessage={updateStartingMessage}
          />
          <RowHeader
            players={game.players}
            timestamp={mostRecentMessage.timestamp}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default function List({
  openGame,
  games,
  fetching,
  updateStartingMessage,
  dataSource,
}) {
  if (fetching) {
    return (
      <View style={styles.list}>
        <View style={styles.listContainer}>
          <Text style={styles.text}>Loading Games</Text>
          <ActivityIndicator style={styles.activityIndicator} />
        </View>
      </View>
    );
  }

  if (games.length) {
    return (
      <SwipeListView
        dataSource={dataSource}
        renderRow={renderRow({
          openGame,
          games,
          updateStartingMessage,
        })}
        renderSeparator={renderSeperator}
        style={styles.container}
        enableEmptySections={true}

        renderHiddenRow={ data => (
          <View>
            <Text>Left</Text>
            <Text>Right</Text>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
    );
  }

  return (
    <View style={styles.list}>
      <View style={styles.listContainer}>
        <Text style={styles.text}>You have no games. That's really weird.</Text>
        <Text style={styles.text}>Contact kevin@scottdesignllc.com for more help.</Text>
      </View>
    </View>
  );
}
