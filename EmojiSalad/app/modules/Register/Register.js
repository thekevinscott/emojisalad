/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import {
  Text,
  TextInput,
  View,
} from 'react-native';

import styles, {
  inputStyle,
  errorStyle,
} from './styles';

import {
  submitClaim,
  updateText,
  updateError,
} from './actions';

function mapStateToProps(state) {
  const {
    text,
    claiming,
    error,
  } = state.register;

  return {
    text,
    claiming,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateError: (error) => {
        return dispatch(updateError(error));
      },
      updateText: (text) => {
        return dispatch(updateText(text));
      },
      submitClaim: (text) => {
        return dispatch(submitClaim(text)).catch(err => {
          // swallow error
        });
      },
    },
  };
}

class Register extends Component {
  constructor(props) {
    super(props);
    this.submitClaim = this.submitClaim.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      this.textInput.focus();
    }
  }

  submitClaim() {
    return this.props.actions.submitClaim(this.props.text);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Wussup. Enter your phone number to migrate over.
        </Text>
        <TextInput
          style={{
            ...inputStyle,
            color: this.props.claiming ? '#AAA' : inputStyle.color,
          }}
          ref={(ref) => { this.textInput = ref; }}
          placeholder="Type your phone number here"
          autoFocus={true}
          autoCorrect={false}
          blurOnSubmit={true}
          enablesReturnKeyAutomatically={true}
          keyboardType="phone-pad"
          onSubmitEditing={this.submitClaim}
          returnKeyType="go"
          onChangeText={this.props.actions.updateText}
          editable={!this.props.claiming}
          value={this.props.text}
        />
        <Text
          style={this.props.error ? errorStyle : {}}
        >
          {this.props.error}
        </Text>
        <Button
          style={styles.button}
          onPress={this.submitClaim}
          disabled={this.props.claiming || !this.props.text}
        >
          Claim your number
        </Button>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
