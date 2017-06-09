import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import LogoutButton from './LogoutButton';

import * as styles from '../styles';
import UserSettings from './UserSettings';

const Settings = ({
  onChange,
  me,
  fields,
}) => {
  return (
    <View style={styles.container}>
      <UserSettings
        user={me}
        onChange={onChange}
        fields={fields}
      />
      <LogoutButton />
    </View>
  );
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  me: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
};

export default Settings;
