import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  constants,
} from '../styles';
import {
  Linking,
} from 'react-native';

import {
  Actions,
  Reducer,
  Router,
  Scene,
} from 'react-native-router-flux';

import {
  Page,
} from 'components/Page';

import {
  Register,
} from 'pages/Register';

import {
  Overview,
} from 'pages/Games';

import {
  Game,
} from 'pages/Game';

import {
  NewGame,
} from 'pages/NewGame';

class Routes extends Component {
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

  render() {
    const newGame = (<FontAwesome name="pencil-square-o" size={30} color={constants.purple} />);
    // This fucks up the connectWithFocus activeComponent
    // listener, since the active component name is Games (24),
    // not Games
    //const gamesTitle = `Games (${this.props.games.length})`;
    const gamesTitle = 'Games';
    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="register"
          component={Page}
          page={Register}
          initial={this.isInitial('register')}
          title="User Registration"
          navigationBarStyle={{
            backgroundColor: '#fafafa',
          }}
        />
        <Scene
          key="games"
          component={Page}
          page={Overview}
          initial={this.isInitial('games')}
          title={gamesTitle}
          rightTitle={newGame}
          onRight={() => {
            Actions.newGame();
          }}
        />
        <Scene
          key="newGame"
          component={NewGame}
          title="New Game"
          leftTitle="Cancel"
          onLeft={() => {
            Actions.games();
          }}
          leftTitle="Invite"
          onLeft={() => {
            console.log('invite!');
          }}
        />
        <Scene
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
