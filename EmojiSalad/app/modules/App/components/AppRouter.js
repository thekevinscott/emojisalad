import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  TouchableHighlight,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as styles from '../styles';

import { Router, Scene } from 'react-native-router-flux';

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

export default class AppRouter extends Component {
  render() {
    const iExist = !!this.props.me.id;
    return (
      <Router>
        <Scene key="root">
          <Scene
            key="register"
            component={Register}
            initial={!iExist}
            navigationBarStyle={{
            }}
          />
          <Scene
            key="games"
            component={Games}
            initial={iExist}
            title="Games"

            me={this.props.me}
          />
          <Scene
            key="game"
            component={Game}
            title=""
            leftTitle="Games"
            onLeft={() => {
              Actions.games();
            }}

            me={this.props.me}
          />
        </Scene>
      </Router>
    );
  }
}
