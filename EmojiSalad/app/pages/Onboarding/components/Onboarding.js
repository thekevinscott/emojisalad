import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  Text,
  View,
} from 'react-native';

import LetsPlay from './LetsPlay';
import Settings from 'components/Settings';

import * as styles from '../styles';

class Onboarding extends Component {
  static propTypes = {
    updateUser: PropTypes.func.isRequired,
    me: PropTypes.object.isRequired,
    saved: PropTypes.bool.isRequired,
    next: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      readyForSubmission: false,
      form: null,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.saved) {
      this.props.next();
    }
  }

  onChange(readyForSubmission, form) {
    this.setState({
      readyForSubmission,
      form,
    });
  }

  render() {
    const disabled = !this.state.readyForSubmission;
    const welcome = 'Hi!';

    return (
      <View style={styles.container}>
        <View style={styles.introText}>
          <Text style={styles.hi}>{ welcome }</Text>
          <Text style={styles.confirm}>Let’s confirm a few things so we can get started.</Text>
        </View>
        <View style={styles.settingsContainer}>
          <Settings
            onChange={this.onChange}
          />
        </View>
        <View style={styles.buttonContainer}>
          <LetsPlay
            disabled={disabled}
            onPress={() => {
              this.props.updateUser(this.state.form, this.props.me);
            }}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Onboarding);
