import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  View,
} from 'react-native';

import * as styles from '../styles';
import GameSettings from 'components/Settings';

class Settings extends Component {
  static propTypes = {
    me: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
      updateSettings: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: null,
    };

    this.onChange = this.onChange.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  componentWillMount() {
    Actions.refresh({
      rightTitle: 'Done',
      onRight: this.updateSettings,
    });
  }

  updateSettings() {
    if (!this.props.pending) {
      this.props.actions.updateSettings(this.state.form, this.props.me).then(() => {
      });
      Actions.pop();
    }
  }

  onChange(readyForSubmission, form) {
    this.setState({
      form,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <GameSettings
          onChange={this.onChange}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Settings);
