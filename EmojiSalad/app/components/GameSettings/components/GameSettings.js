import { Actions, } from 'react-native-router-flux';
import connectWithFocus from 'utils/connectWithFocus';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { connect } from 'react-redux';
import {
  View,
  //Text,
} from 'react-native';

import * as styles from '../styles';

import List from 'components/List';
import Player from './Player';
import NameOfGame from './NameOfGame';
import AddPlayer from './AddPlayer';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  makeNameFromPlayers,
} from 'pages/Game/selectors';

class GameSettings extends Component {
  static key = 'gameSettings';

  static propTypes = {
    actions: PropTypes.shape({
      invitePlayer: PropTypes.func.isRequired,
      updateGame: PropTypes.func.isRequired,
    }).isRequired,
    game: PropTypes.shape({
      name: PropTypes.string,
      players: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        nickname: PropTypes.string,
        key: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    me: PropTypes.object.isRequired,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      invitedPlayers: {},
      gameName: props.game.name || '',
      changedGameName: false,
    };

    this.getData = this.getData.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.updateGameName = this.updateGameName.bind(this);
    this.updateGame = this.updateGame.bind(this);
  }

  componentWillAppear() {
    console.log('game settings will appear');
    Actions.refresh({
      onRight: this.updateGame,
    });
  }

  updateGame() {
    if (this.state.changedGameName) {
      this.props.actions.updateGame(this.props.game, {
        name: this.state.gameName,
      });
    }
    Actions.pop();
  }

  updateGameName(e) {
    this.setState({
      ...this.state,
      changedGameName: true,
      gameName: e,
    });
  }

  addPlayer(player) {
    const keys = Object.keys(this.state.invitedPlayers);
    const invitedPlayers = {
      ...this.state.invitedPlayers,
      [player.id]: {
        player,
        order: keys.length + 1,
      },
    };
    this.setState({
      invitedPlayers,
    });

    Actions.pop();

    if (this.props.onChange) {
      this.props.onChange(player);
    }
  }

  getData() {
    const invitedPlayers = Object.keys(this.state.invitedPlayers).map(key => {
      return this.state.invitedPlayers[key];
    }).sort((a, b) => {
      return a.order - b.order;
    }).map(({ player }) => player);

    return {
      sectionOne: [
        (<NameOfGame
          key="nameOfGame"
          onChange={this.updateGameName}
          name={this.state.gameName}
          placeholder={makeNameFromPlayers(this.props.game.players.concat(invitedPlayers))}
        />),
      ].concat(invitedPlayers.map(player => (
        <Player
          key={player.id}
          player={player}
        />
      ))).concat([
        (<AddPlayer
          key="addPlayer"
          findPlayerToInvite={() => {
            Actions.invite({
              addPlayer: this.addPlayer,
            });
          }}
        />),
      ]),
    };
  }

  render() {
    return (
      <View
        style={styles.gameSettings}
      >
        <List
          data={this.getData()}
        />
      </View>
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps,
)(GameSettings);
