/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
//import Button from 'react-native-button';
import {
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';

import styles from '../styles';
//import {
  //purple,
//} from '../../App/styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class Register extends Component {
  constructor(props) {
    super(props);
    this.submitClaim = this.submitClaim.bind(this);
    this.state = {
      color: new Animated.Value(0),
      fakeMigration: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error && nextProps.error !== this.props.error) {
      this.textInput.focus();
    }

    if (nextProps.me && nextProps.me.key && !this.props.me.key) {
      this.setState({
        fakeMigration: new Date(),
      });
      Animated.timing(
        this.state.color,
        {
          toValue: 1000,
          duration: 400,
        }
      ).start();
    }

    if (nextProps.migration === 'complete') {
      // take at least x seconds
      const migrationTime = 2500;
      const timePassed = new Date() - this.state.fakeMigration;
      if (timePassed < migrationTime) {
        setTimeout(() => {
          console.log('go to next game!');
          this.props.actions.goToGames();
        }, migrationTime - timePassed);
      } else {
        this.props.actions.goToGames();
      }
    }
  }

  submitClaim() {
    return this.props.actions.submitClaim(this.props.text);
  }

  componentDidMount() {
    this.state.color.setValue(0);
  }

  render() {
    const backgroundColor = this.state.color.interpolate({
      inputRange: [0, 1000],
      outputRange: ['rgb(255, 255, 255)', 'rgb(189,16,224)'],
    });
    const headerColor = this.state.color.interpolate({
      inputRange: [0, 1000],
      outputRange: ['rgb(189,16,224)', 'rgb(255, 255, 255)'],
    });
    const bodyColor = this.state.color.interpolate({
      inputRange: [0, 1000],
      outputRange: ['rgb(100, 100, 100)', 'rgb(255, 255, 255)'],
    });
    const containerStyle = {
      ...styles.container,
      backgroundColor,
    };
    const headerStyle = {
      ...styles.header,
      color: headerColor,
    };
    const bodyStyle = {
      ...styles.body,
      color: bodyColor,
    };

    const success = (this.props.me && this.props.me.key) ? (
      <Animated.Text style={bodyStyle}>
        Welcome, {this.props.me.nickname}! Please wait while we migrate your games and texts over.
      </Animated.Text>
    ) : null;

    return (
      <Animated.View style={containerStyle}>
        <View style={styles.textContainer}>
          <Animated.Text style={headerStyle}>
            Welcome to the Emoji Salad App Beta!
          </Animated.Text>
          <Animated.Text style={bodyStyle}>
            This beta is by invitation only. Please enter the phone number you used for the SMS version of the game.
          </Animated.Text>
          <Animated.Text style={bodyStyle}>
            We're positively tickled to have you here!
          </Animated.Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={{
              ...styles.input,
              color: this.props.claiming ? '#AAA' : styles.input.color,
            }}
            ref={(ref) => { this.textInput = ref; }}
            placeholder="Type your phone number here"
            autoFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={true}
            underlineColorAndroid="transparent"
            onSubmitEditing={this.submitClaim}
            returnKeyType="join"
            onChangeText={this.props.actions.updateText}
            //editable={!this.props.claiming}
            value={this.props.text}
          />
        </View>
        {this.props.error ? (
          <Text
            style={styles.error}
          >
            {this.props.error}
          </Text>
          ) : null
        }
        {success}
      </Animated.View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Register);
