/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Navigator,
} from 'react-native';

import {
  containerStyle,
  welcomeStyle,
} from './styles';

import {
} from './actions';

function mapStateToProps(state) {
  const {
  } = state.games;

  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
    },
  };
}

class Games extends Component {
  render() {
    return (
      <View style={containerStyle}>
        <Text style={welcomeStyle}>
          These are the games
        </Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Games);
