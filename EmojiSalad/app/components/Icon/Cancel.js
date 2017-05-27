import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

const Cancel = ({
  onPress,
  color,
  size,
}) => (
  <Icon
    onPress={onPress}
    icon="ios-close-circle"
    color={color}
    size={size}
  />
);

Cancel.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Cancel;
