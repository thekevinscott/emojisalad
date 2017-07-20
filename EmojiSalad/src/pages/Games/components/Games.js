import React from 'react';
import PropTypes from 'prop-types';

import Body from './Body';
import {
  //Text,
  View,
  RefreshControl,
  //Alert,
  //BodyView,
  //PushNotificationIOS,
  //Alert,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

const Games = ({
  fetching,
  refresh,
  games,
  data,
  pauseGame,
  leaveGame,
  navigate,
}) => (
  <View
    style={styles.games}
  >
    <Body
      refreshControl={(
        <RefreshControl
          refreshing={fetching}
          onRefresh={refresh}
        />
      )}
      data={data}
      fetching={fetching}
      games={games}
      pauseGame={pauseGame}
      leaveGame={leaveGame}
      navigate={navigate}
    />
  </View>
);

Games.propTypes = {
  fetching: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    games: PropTypes.array.isRequired,
    invites: PropTypes.array.isRequired,
  }).isRequired,
  games: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    invites: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })).isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      nickname: PropTypes.string,
      key: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  pauseGame: PropTypes.func.isRequired,
  leaveGame: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default Games;
