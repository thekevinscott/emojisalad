import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  View,
} from 'react-native';

import LogoutButton from './LogoutButton';

import * as styles from '../styles';
import UserSettings from './UserSettings';

const Settings = ({
  onChange,
  me,
}) => {
  return (
    <View style={styles.container}>
      <UserSettings
        me={me}
        onChange={onChange}
        fields={[]}
      />
      <LogoutButton />
    </View>
  );
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Settings);
