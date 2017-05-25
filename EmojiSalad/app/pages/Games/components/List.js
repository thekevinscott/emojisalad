import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Game from './Game';
import HiddenButtons from './HiddenButtons';
import Separator from './Separator';

import * as styles from '../styles';

const renderSeparator = (sectionID, rowID, adjacentRowHighlighted) => (
  <Separator
    sectionID={sectionID}
    rowID={rowID}
    adjacentRowHighlighted={adjacentRowHighlighted}
  />
);

const renderRow = ({
  openGame,
  games,
  updateStartingMessage,
}) => (
  game,
  sectionID,
  rowID,
) => (
  <Game
    rowID={rowID}
    game={game}
    games={games}
    openGame={openGame}
    updateStartingMessage={updateStartingMessage}
  />
);

renderRow.propTypes = {
  game: PropTypes.object.isRequired,
};

export default function List({
  openGame,
  games,
  fetching,
  updateStartingMessage,
  dataSource,
  pauseGame,
  leaveGame,
}) {
  if (fetching && (!games || games.length === 0)) {
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
        disableRightSwipe={true}
        style={styles.container}
        enableEmptySections={true}
        dataSource={dataSource}
        renderRow={renderRow({
          openGame,
          games,
          updateStartingMessage,
        })}
        renderSeparator={renderSeparator}

        renderHiddenRow={ (game, sectionID, rowID, rows) => (
          <HiddenButtons
            game={game}
            pauseGame={pauseGame}
            leaveGame={leaveGame}
            sectionID={sectionID}
            rowID={rowID}
            rows={rows}
          />
        )}
        rightOpenValue={-1 * (2 * styles.buttonBehind.width)}
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

List.propTypes = {
  openGame: PropTypes.func.isRequired,
  games: PropTypes.array.isRequired,
  fetching: PropTypes.bool.isRequired,
  updateStartingMessage: PropTypes.func.isRequired,
  dataSource: PropTypes.any,
  pauseGame: PropTypes.func.isRequired,
  leaveGame: PropTypes.func.isRequired,
};
