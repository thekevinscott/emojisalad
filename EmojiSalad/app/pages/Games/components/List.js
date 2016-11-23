/**
 * @flow
 */

import React from 'react';

import {
  Text,
  ActivityIndicator,
  View,
  TouchableHighlight,
  ListView,
  //RefreshControl,
} from 'react-native';

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

const renderRow = ({
  openGame,
  games,
  updateStartingMessage,
}) => (game, sectionId, rowId) => {
  const messages = game.messages;
  const mostRecentMessage = messages[messages.length - 1] || {};
  const unreadDotStyle = {
    ...styles.unreadDot,
    opacity: (mostRecentMessage.key !== game.lastRead) ? 1 : 0,
  };

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
          <ActivityIndicator style={styles.activityIndicator} />
          <Text>Loading Games</Text>
        </View>
      </View>
    );
  }

  if (games.length) {
    return (
      <ListView
        dataSource={dataSource}
        renderRow={renderRow({
          openGame,
          games,
          updateStartingMessage,
        })}
        renderSeparator={renderSeperator}
        style={styles.container}
        enableEmptySections={true}
      />
    );
  }

  return (
    <View style={styles.list}>
      <View style={styles.listContainer}>
        <Text>You have no games. That's really weird.</Text>
        <Text>Contact kevin@scottdesignllc.com for more help.</Text>
      </View>
    </View>
  );
}
