import React, { Component } from 'react';
//import { Actions, } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import connectWithFocus from 'utils/connectWithFocus';

import Game from './components/Game';
import Games from './components/Games';
import Invite from './components/Invite';
import navigationOptions from './navigationOptions';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';

class GamesContainer extends Component {
  static key = 'games';

  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    invites: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
    })).isRequired,
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
    me: PropTypes.shape({
      key: PropTypes.string,
    }).isRequired,
    actions: PropTypes.shape({
      fetchData: PropTypes.func.isRequired,
      openGame: PropTypes.func.isRequired,
      pauseGame: PropTypes.func.isRequired,
      leaveGame: PropTypes.func.isRequired,
      updateStartingMessage: PropTypes.func.isRequired,
      confirmInvite: PropTypes.func.isRequired,
      cancelInvite: PropTypes.func.isRequired,
    }).isRequired,
    navigation: PropTypes.object.isRequired,
  };

  static navigationOptions = navigationOptions;

  constructor(props) {
    super(props);

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      games: this.props.games,
    });
  }

  componentWillAppear({
    type,
  }) {
    console.log('Overview Component componentWillAppear called', type);
    this.refresh();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.games.length != nextProps.games.length) {
      this.props.navigation.setParams({
        games: nextProps.games,
      });
    }
  }

  refresh() {
    if (!this.props.fetching) {
      this.props.actions.fetchData(this.props.me.key);
    }
  }

  render() {
    const {
      invites,
      me,
      games,
      actions: {
        cancelInvite,
        confirmInvite,
        openGame,
        updateStartingMessage,
      },
    } = this.props;

    const data = {
      'invites': invites.map(invite => {
        return (
          <Invite
            key={invite.key}
            invite={invite}
            cancelInvite={() => {
              cancelInvite(me.key, invite);
            }}
            confirmInvite={() => {
              confirmInvite(me.key, invite);
            }}
          />
        );
      }),
      'games': games.map(game => {
        return (
          <Game
            key={game.key}
            game={game}
            openGame={() => {
              openGame(game, games);
            }}
            updateStartingMessage={updateStartingMessage}
          />
        );
      }),
    };

    return (
      <Games
        fetching={this.props.fetching}
        games={this.props.games}
        data={data}
        pauseGame={game => {
          this.props.actions.pauseGame(this.props.me, game);
        }}
        leaveGame={game => {
          this.props.actions.leaveGame(this.props.me, game);
        }}
        refresh={this.refresh}
        navigate={this.props.navigation.navigate}
      />
    );
  }
}

export default connectWithFocus(
  mapStateToProps,
  mapDispatchToProps
)(GamesContainer);
