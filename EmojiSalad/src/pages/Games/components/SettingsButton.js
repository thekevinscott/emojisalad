import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'react-native';

const SettingsButton = ({
  navigate,
}) => (
  <Button
    title="Settings"
    onPress={() => {
      navigate('Settings');
    }}
  />
);

SettingsButton.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default SettingsButton;
