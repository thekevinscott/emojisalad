/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableHighlight,
} from 'react-native';

import * as styles from './styles';

//import {
//} from './actions';

function mapStateToProps(state) {
  //const {
  //} = state.games;

  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {},
  };
}

class Game extends Component {
  render() {
    const {
      game,
    } = this.props;
    return (
      <View style={{ marginTop: 200 }}>
        <Text>
          This is game: {game.id}
        </Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
