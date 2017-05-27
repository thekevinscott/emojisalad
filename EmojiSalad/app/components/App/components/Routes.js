import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  constants,
} from '../styles';
import {
  Linking,
} from 'react-native';

import {
  Actions,
  ActionConst,
  Reducer,
  Router,
  Scene,
} from 'react-native-router-flux';

import {
  Page,
} from 'components/Page';

//import {
  //Register,
//} from 'pages/Register';

import Games from 'pages/Games';

import {
  Game,
} from 'pages/Game';

import NewGame from 'pages/NewGame';
import GameDetails from 'pages/GameDetails';

import Invite from 'pages/Invite';

import Login from 'pages/Login';
import Onboarding from 'pages/Onboarding';
import Settings from 'pages/Settings';

class Routes extends Component {
  static propTypes = {
    me: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL(event) {
    if (event.url && event.url.indexOf('emojisalad://') === 0) {
      const path = event.url.split('emojisalad://').pop();
      if (path.indexOf('games/' === 0)) {
        const gameKey = path.split('/').pop();
        Actions.game({
          game: {
            key: gameKey,
          },
        });
      }
    }
  }

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  isInitial(key) {
    if (key === 'register') {
      return !this.props.me.key;
    } else if (key === 'games') {
      return !!this.props.me.key;
    } else if (key === 'game') {
      return false;
    }
  }

  /*
  push: ActionConst.PUSH,
  replace: ActionConst.REPLACE,
  */
  render() {
    const newGame = (<FontAwesomeIcon name="pencil-square-o" size={30} color={constants.purple} />);
    const settings = (<Ionicons name="ios-settings" size={30} color={constants.purple} />);
    const information = (<Ionicons name="ios-information-circle-outline" size={30} color={constants.purple} />);
    // This fucks up the connectWithFocus activeComponent
    // listener, since the active component name is Games (24),
    // not Games
    //const gamesTitle = `Games (${this.props.games.length})`;
    const gamesTitle = 'Games';
    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          passProps
          key="login"
          component={Page}
          page={Login}
          initial={this.isInitial('register')}
          title=""
        />
        <Scene
          passProps
          key="settings"
          component={Page}
          page={Settings}
          type={ActionConst.PUSH}
          title=""
        />
        <Scene
          passProps
          key="onboarding"
          component={Page}
          page={Onboarding}
          title=""
        />
        <Scene
          passProps
          key="games"
          component={Page}
          page={Games}
          initial={this.isInitial('games')}
          title={gamesTitle}
          leftTitle={settings}
          onLeft={() => {
            Actions.settings();
          }}
          rightTitle={newGame}
          onRight={() => {
            Actions.newGame();
          }}
        />
        <Scene
          passProps
          key="gameDetails"
          direction="vertical"
          type={ActionConst.PUSH}
          component={Page}
          page={GameDetails}
          title="Details"
          rightTitle="Done"
          onRight={() => {
            Actions.pop();
          }}
        />
        <Scene
          passProps
          key="newGame"
          direction="vertical"
          type={ActionConst.PUSH}
          component={Page}
          page={NewGame}
          title="New Game"
          leftTitle="Cancel"
          onLeft={() => {
            Actions.games();
          }}
        />
        <Scene
          passProps
          key="invite"
          direction="vertical"
          type={ActionConst.PUSH}
          component={Page}
          page={Invite}
          title="Add Player"
          leftTitle="Back"
        />
        <Scene
          passProps
          key="game"
          component={Page}
          page={Game}
          initial={this.isInitial('game')}
          title="Game"
          leftTitle="Games"
          onLeft={() => {
            //console.log('action games 1');
            Actions.games();
          }}
          rightTitle={information}
          onRight={({ game }) => {
            Actions.gameDetails({
              game,
            });
          }}
        />
      </Scene>
    );

    return (
      <Router
        createReducer={this.reducerCreate.bind(this)}
        scenes={scenes} />
    );
  }
}

export default connect()(Routes);
