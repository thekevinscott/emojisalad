import React from 'react';
import Icon, { IconPropTypes } from 'components/Icon';
//import PropTypes from 'prop-types';

const Information = ({
  onPress,
  color,
  size,
}) => {
  return (
    <Icon
      onPress={onPress}
      icon="ios-information-circle-outline"
      color={color}
      size={size}
    />
  );
};

Information.propTypes = {
  ...IconPropTypes,
};

export default Information;
