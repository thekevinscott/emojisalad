import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

const Add = ({
  onPress,
  color,
}) => (
  <Icon
    onPress={onPress}
    icon="ios-add-circle-outline"
    color={color}
  />
);

Add.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default Add;
