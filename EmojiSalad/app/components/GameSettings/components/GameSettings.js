import { Actions, } from 'react-native-router-flux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

const getNameOfGame = (players) => {
  return players.map(({
    name,
    nickname,
  }) => {
    return nickname || name || '';
  }).map(name => name.split(' ').shift()).filter(n => n).join(', ');
};

class GameSettings extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      invitePlayer: PropTypes.func.isRequired,
    }).isRequired,
    startGame: PropTypes.func.isRequired,
    me: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      invitedPlayers: {},
    };

    this.getData = this.getData.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
  }

  componentWillMount() {
    Actions.refresh({
      rightTitle: 'Done',
      onRight: () => {
        this.props.startGame(this.state.invitedPlayers);
      }
    });

    //const keys = Object.keys(this.state.invitedPlayers);
    //if (keys.length === 0) {
      //Actions.invite({
        //addPlayer: this.addPlayer,
      //});
    //}
  }

  addPlayer(player) {
    const keys = Object.keys(this.state.invitedPlayers);
    this.setState({
      invitedPlayers: {
        ...this.state.invitedPlayers,
        [player.id]: {
          player,
          order: keys.length + 1,
        },
      },
    });
    Actions.pop();
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
          name={getNameOfGame([this.props.me].concat(invitedPlayers))}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameSettings);
