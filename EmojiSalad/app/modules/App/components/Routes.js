import React, { Component } from 'react';
import { connect } from 'react-redux';

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
  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action);
      return defaultReducer(state, action);
    };
  }

  render() {
    const iExist = !!this.props.me.key;

    const scenes = Actions.create(
      <Scene key="root">
        <Scene
          key="register"
          component={Register}
          initial={!iExist}
          title="User Registration"
          navigationBarStyle={{
            backgroundColor: '#fafafa',
          }}
        />
        <Scene
          key="games"
          component={Games}
          initial={iExist}
          title="Games"
        />
        <Scene
          key="game"
          component={Game}
          title="Game"
          leftTitle="Games"
          onLeft={() => {
            Actions.games();
          }}
          rightTitle="DevTools"
          onRight={() => {
            console.log('show it');
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
