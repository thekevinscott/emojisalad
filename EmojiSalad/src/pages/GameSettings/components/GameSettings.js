import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import NameOfGame from './NameOfGame';
//import Player from './Player';
import AddPlayer from './AddPlayer';

import * as styles from '../styles';

import List from 'components/List';

const getSections = ({
  name,
  updateGameName,
  findPlayerToInvite,
}) => {
  return {
    sectionOne: [
      (<NameOfGame
        key="nameOfGame"
        onChange={updateGameName}
        name={name}
        placeholder={"foobar"}
      />),
    ].concat([
      (<AddPlayer
        key="addPlayer"
        findPlayerToInvite={findPlayerToInvite}
      />),
    ]),
  };
};

const GameSettings = ({
  gameName,
  updateGameName,
  findPlayerToInvite,
}) => {
  const data = getSections({
    name: gameName,
    updateGameName,
    findPlayerToInvite,
  });

  return (
    <View
      style={styles.gameSettings}
    >
      <List
        data={data}
      />
    </View>
  );
}

GameSettings.propTypes = {
  gameName: PropTypes.string,
  updateGameName: PropTypes.func.isRequired,
  findPlayerToInvite: PropTypes.func.isRequired,
  /*
  actions: PropTypes.shape({
    invitePlayer: PropTypes.func.isRequired,
    updateGame: PropTypes.func.isRequired,
  }).isRequired,
  game: PropTypes.shape({
    name: PropTypes.string,
    invites: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })).isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      nickname: PropTypes.string,
      key: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  me: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  players: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    nickname: PropTypes.string,
    avatar: PropTypes.string,
    // TODO: This should be an enum
    status: PropTypes.string.isRequired,
  })).isRequired,
  */
};

export default GameSettings;
