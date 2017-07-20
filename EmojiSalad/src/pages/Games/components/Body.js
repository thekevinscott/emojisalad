import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
  //ActivityIndicator,
  View,
} from 'react-native';
//import { SwipeListView } from 'react-native-swipe-list-view';
import List from 'components/List';
//import Game from './Game';
//import HiddenButtons from './HiddenButtons';
//import Separator from './Separator';

import * as styles from '../styles';

/*
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
*/

const Body = ({
  data,
  refreshControl,
  navigate,
}) => {
  //if (fetching && (!games || games.length === 0)) {
    //return (
      //<View style={styles.list}>
        //<View style={styles.listContainer}>
          //<Text style={styles.text}>Loading Games</Text>
          //<ActivityIndicator style={styles.activityIndicator} />
        //</View>
      //</View>
    //);
  //}

  if (data.games.length) {
    return (
      <List
        data={data}
        noRowPadding
        refreshControl={refreshControl}
      />
    );
    //return (
      //<SwipeListView
        //disableRightSwipe={true}
        //style={styles.container}
        //enableEmptySections={true}
        //dataSource={dataSource}
        //renderRow={renderRow({
          //openGame,
          //games,
          //updateStartingMessage,
        //})}
        //renderSeparator={renderSeparator}

        //renderHiddenRow={ (game, sectionID, rowID, rows) => (
          //<HiddenButtons
            //game={game}
            //pauseGame={pauseGame}
            //leaveGame={leaveGame}
            //sectionID={sectionID}
            //rowID={rowID}
            //rows={rows}
          ///>
        //)}
        //rightOpenValue={-1 * (2 * styles.buttonBehind.width)}
      ///>
    //);
  }

  return (
    <View style={styles.list}>
      <TouchableOpacity
        style={styles.listContainer}
        onPress={() => {
          navigate('GameSettings');
        }}
      >
        <Text style={styles.text}>You have no games. Start a new game with your friends!</Text>
      </TouchableOpacity>
    </View>
  );
}

Body.propTypes = {
  //openGame: PropTypes.func.isRequired,
  //games: PropTypes.array.isRequired,
  //fetching: PropTypes.bool.isRequired,
  //updateStartingMessage: PropTypes.func.isRequired,
  //dataSource: PropTypes.any,
  //pauseGame: PropTypes.func.isRequired,
  //leaveGame: PropTypes.func.isRequired,
  data: PropTypes.shape({
    games: PropTypes.arrayOf(PropTypes.node).isRequired,
  }).isRequired,
  refreshControl: PropTypes.node,
  navigate: PropTypes.func.isRequired,
};

export default Body;
