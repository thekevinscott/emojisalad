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
} from '../../Register';

import {
  Games,
} from '../../Games';

import {
  Game,
} from '../../Game';

class Routes extends Component {
  constructor(props) {
    super(props);
    Linking.getInitialURL().then((url) => {
      this.initialUrl = url;
    });
  }

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  isInitial(key) {
    console.log('initial url', this.initialUrl);
    if (key === 'register') {
      return !this.props.me.key;
    } else if (key === 'games') {
      return !!this.props.me.key;
    } else if (key === 'game') {
      return false;
    }
  }

  render() {
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
          title="Games"
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
