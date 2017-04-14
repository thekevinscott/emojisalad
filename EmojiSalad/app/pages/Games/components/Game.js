import React from 'react';

import Messages from './Messages';
import RowHeader from './RowHeader';

import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import * as styles from '../styles';

const getUnreadStyle = ({ isUnread }) => ({
  ...styles.unreadDot,
  opacity: isUnread ? 1 : 0,
});

const Game = ({
  rowID,
  game,
  games,
  openGame,
  updateStartingMessage,
}) => {
  const messages = game.messages;
  const mostRecentMessage = messages[messages.length - 1] || {};

  const unreadDotStyle = getUnreadStyle(game);

  return (
    <TouchableHighlight
      onPress={() => {
        openGame(game, games);
      }}
      key={`${rowID}`}
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

export default Game;
