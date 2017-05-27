import React from 'react';
import PropTypes from 'prop-types';

import Messages from './Messages';
import GameHeader from './GameHeader';

import {
  //Text,
  View,
  TouchableOpacity,
} from 'react-native';

import * as styles from '../styles';

const getUnreadStyle = ({ isUnread }) => ({
  ...styles.unreadDot,
  opacity: isUnread ? 1 : 0,
});

const Game = ({
  game,
  openGame,
  updateStartingMessage,
}) => {
  const messages = game.messages;
  const mostRecentMessage = messages[messages.length - 1] || {};

  const unreadDotStyle = getUnreadStyle(game);

  return (
    <TouchableOpacity
      onPress={openGame}
      style={styles.row}
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
          <GameHeader
            players={game.players}
            timestamp={mostRecentMessage.timestamp}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

Game.propTypes = {
  game: PropTypes.shape({
    key: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    players: PropTypes.array.isRequired,
    isUnread: PropTypes.bool.isRequired,
  }).isRequired,
  openGame: PropTypes.func.isRequired,
  updateStartingMessage: PropTypes.func.isRequired,
};

export default Game;
