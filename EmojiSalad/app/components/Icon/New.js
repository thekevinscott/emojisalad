import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

const New = ({
  onPress,
  color,
  size,
}) => (
  <Icon
    onPress={onPress}
    icon="pencil-square-o"
    color={color}
    size={size}
  />
);

New.propTypes = {
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.number,
};

export default New;
