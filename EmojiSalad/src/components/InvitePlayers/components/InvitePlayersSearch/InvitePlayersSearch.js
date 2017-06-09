import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  TextInput,
} from 'react-native';

import Add from './Add';
import Label from './Label';

import * as styles from '../../styles';

import {
  parsePhoneNumber,
  //isValidPhoneNumber,
} from './utils';

class InvitePlayersSearch extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    //this.addPlayer = this.addPlayer.bind(this);
  }

  state={
    text: '',
  };

  onChangeText(input) {
    const phoneNumber = parsePhoneNumber(input);
    this.setState({
      text: phoneNumber,
    });
  }

  render() {
    return (
      <View style={styles.invitePlayers}>
        <Label />
        <TextInput
          style={styles.invitePlayer}
          keyboardType="phone-pad"
          value={this.state.text}
          placeholder="555-555-5555"
          onChangeText={this.onChangeText}
          autoFocus
        />
        <Add
          disabled={this.state.text === ''}
          onPress={this.props.invitePlayer}
        />
      </View>
    );
  }
}

InvitePlayersSearch.propTypes = {
  invitePlayer: PropTypes.func.isRequired,
};

export default InvitePlayersSearch;
