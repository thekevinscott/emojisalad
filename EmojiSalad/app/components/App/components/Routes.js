import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  Register,
} from 'app/pages/Register';

import {
  Games,
} from 'app/pages/Games';

import {
  Game,
} from 'app/pages/Game';

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
    // This fucks up the connectWithFocus activeComponent
    // listener, since the active component name is Games (24),
    // not Games
    //const gamesTitle = `Games (${this.props.games.length})`;
    const gamesTitle = 'Games';
    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="register"
          component={Register}
          initial={this.isInitial('register')}
          title="User Registration"
          navigationBarStyle={{
            backgroundColor: '#fafafa',
          }}
        />
        <Scene
          key="games"
          component={Games}
          initial={this.isInitial('games')}
          title={gamesTitle}
        />
        <Scene
          key="game"
          component={Game}
          initial={this.isInitial('game')}
          title="Game"
          leftTitle="Games"
          onLeft={() => {
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
