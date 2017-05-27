import React from 'react';
import Icon, { IconPropTypes } from 'components/Icon';
import PropTypes from 'prop-types';

const getDirection = ({
  right,
}) => {
  if (right) {
    return 'ios-arrow-forward-outline';
  }

  return null;
};

const Chevron = ({
  onPress,
  color,
  size,
  right,
}) => {
  const direction = getDirection({
    right,
  });

  return (
    <Icon
      onPress={onPress}
      icon={direction}
      color={color}
      size={size}
    />
  );
};

Chevron.propTypes = {
  ...IconPropTypes,
  right: PropTypes.bool,
};

export default Chevron;
