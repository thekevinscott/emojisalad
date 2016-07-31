import React, { Component } from 'react';
//import {
  //View,
  //Text,
  //Navigator,
  //TouchableHighlight,
//} from 'react-native';
import { Actions } from 'react-native-router-flux';

//import * as styles from '../styles';

import { Router as _Router, Scene } from 'react-native-router-flux';

import RegisterContents from '../../Register';
const {
  Register,
} = RegisterContents;

import GamesContents from '../../Games';
const {
  Games,
} = GamesContents;

import GameContents from '../../Game';
const {
  Game,
} = GameContents;

export default class Router extends Component {
  render() {
    const iExist = !!this.props.me.key;
    return (
      <_Router>
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
            title=""
            leftTitle="Games"
            onLeft={() => {
              Actions.games();
            }}
          />
        </Scene>
      </_Router>
    );
  }
}
