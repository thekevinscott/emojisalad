import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'react-native';

const SaveButton = ({
  handlePress,
}) => (
  <Button
    title="Done"
    onPress={handlePress}
  />
);

SaveButton.propTypes = {
  handlePress: PropTypes.func.isRequired,
};

export default SaveButton;
