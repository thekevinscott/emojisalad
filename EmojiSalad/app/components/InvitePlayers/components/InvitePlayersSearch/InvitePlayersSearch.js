/**
 * @flow
 */

import React, { PropTypes, Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  constants,
} from 'components/App/styles';

import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import Add from './Add';
import Label from './Label';

import * as styles from '../../styles';

import {
  parsePhoneNumber,
  isValidPhoneNumber,
} from './utils';

class InvitePlayersSearch extends Component {
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
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

  addPlayer() {
    if (isValidPhoneNumber(this.state.text)) {
      this.props.invitePlayer(this.state.text);
      this.setState({
        text: '',
      });
    }

    return false;
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
          maxLength={12}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.addPlayer}
          autoFocus
        />
        <Add
          disabled={this.state.text === ''}
          onPress={this.addPlayer}
        />
      </View>
    );
  }
}

InvitePlayersSearch.propTypes = {
  invitePlayer: PropTypes.func.isRequired,
};

export default InvitePlayersSearch;
