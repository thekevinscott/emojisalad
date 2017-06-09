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

import Games from 'pages/Games';
import { Base } from 'core/Authentication';

import {
  Game,
} from 'pages/Game';

import GameSettings from 'pages/GameSettings';

import Invite from 'pages/Invite';

import Settings from 'pages/Settings';

class Routes extends Component {
  static propTypes = {
    me: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    games: PropTypes.array.isRequired,
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
    if (key === 'settings') {
      return !this.props.me.registered;
    } else if (key === 'games') {
      return !!this.props.me.registered && this.props.me.key;
    } else if (key === 'hide') {
      return !!this.props.me.key;
    }

    return false;
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
    //const gamesTitle = 'Games';
    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="hide"
          initial={this.isInitial('hide')}
          component={Base}
        />
        <Scene
          passProps
          key="settings"
          component={Settings}
          type={ActionConst.PUSH}
          title=""
        />
        <Scene
          passProps
          key="settings"
          initial={this.isInitial('settings')}
          component={Settings}
          title=""
        />
        <Scene
          passProps
          key="games"
          component={Games}
          initial={this.isInitial('games')}
          leftTitle={settings}
          onLeft={() => {
            Actions.settings();
          }}
          rightTitle={newGame}
          onRight={() => {
            Actions.gameSettings();
          }}
        />
        <Scene
          passProps
          key="gameSettings"
          direction="vertical"
          type={ActionConst.PUSH}
          component={GameSettings}
          title="GameSettings"
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
          component={Invite}
          title="Add Player"
          leftTitle="Back"
        />
        <Scene
          passProps
          key="game"
          component={Game}
          title="Game"
          leftTitle="Games"
          onLeft={() => {
            //console.log('action games 1');
            Actions.games();
          }}
          rightTitle={information}
          onRight={({ game }) => {
            Actions.gameSettings({
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
