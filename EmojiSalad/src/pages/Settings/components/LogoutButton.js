import React from 'react';
//import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import {
  Logout,
} from 'core/Authentication';

import * as styles from '../styles';

const LogoutButton = () => {
  return (
    <View
      style={styles.logout}
    >
      <Logout />
    </View>
  );
};

export default LogoutButton;
