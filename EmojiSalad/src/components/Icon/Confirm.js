import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

const Confirm = ({
  onPress,
  color,
  size,
}) => (
  <Icon
    onPress={onPress}
    icon="ios-checkmark-circle"
    color={color}
    size={size}
  />
);

Confirm.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default Confirm;
