import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import connectWithFocus from 'utils/connectWithFocus';

import GameSettings from './components/GameSettings';
import navigationOptions from './navigationOptions';
//import {
  //makeNameFromPlayers,
//} from 'pages/Game/selectors';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';

class GameSettingsContainer extends Component {
  static key = 'gameSettings';

  static navigationOptions = navigationOptions;

  static propTypes = {
    actions: PropTypes.shape({
      saveGame: PropTypes.func.isRequired,
    }).isRequired,
  };

  /*
  static propTypes = {
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
      invitePlayer: PropTypes.func.isRequired,
      updateGame: PropTypes.func.isRequired,
    }).isRequired,
    pending: PropTypes.bool.isRequired,

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
    }),
    me: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      nickname: PropTypes.string,
      avatar: PropTypes.string,
      // TODO: This should be an enum
      status: PropTypes.string.isRequired,
    })).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      invitedPlayers: {},
      gameName: props.game.name || '',
      changedGameName: false,
    };

    this.onChange = this.onChange.bind(this);
    this.startGame = this.startGame.bind(this);

    this.getData = this.getData.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.updateGameName = this.updateGameName.bind(this);
    this.updateGame = this.updateGame.bind(this);
  }

  startGame() {
    if (!this.props.pending) {
      this.props.actions.startGame(this.props.me.key, this.state.invitedPlayers);
    }
  }

  componentDidMount() {
    console.log('component did Mount');
    Actions.refresh({
      rightTitle: 'Done',
      onRight: this.startGame,
    });
    Actions.refresh({
      onRight: this.updateGame,
    });
  }

  onChange(player) {
    this.setState({
      ...this.state.invitedPlayers,
      [player.id]: player,
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
      ].concat(this.props.players.map((player, index) => (
        <Player
          key={`${player}-${index}`}
          player={player}
        />
      ))).concat([
        (<AddPlayer
          key="addPlayer"
          findPlayerToInvite={() => {
            Actions.invite({
              addPlayer: this.addPlayer,
              game: this.props.game,
            });
          }}
        />),
      ]),
    };
  }

        data={this.getData()}
        game={{ players: [this.props.me] }}
        onChange={this.onChange}

  */

  componentWillAppear() {
  }

  render() {
    return (
      <GameSettings
        name="foo"
        updateGameName={() => {}}
        findPlayerToInvite={() => {
          debugger;
          //Actions.invite({
            //addPlayer: this.addPlayer,
            //game: this.props.game,
          //});
        }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameSettingsContainer);
