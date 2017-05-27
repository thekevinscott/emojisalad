import React from 'react';
import Icon, { IconPropTypes } from 'components/Icon';
//import PropTypes from 'prop-types';

const Search = ({
  onPress,
  color,
  size,
}) => {
  return (
    <Icon
      onPress={onPress}
      icon="ios-search"
      color={color}
      size={size}
    />
  );
};

Search.propTypes = {
  ...IconPropTypes,
};

export default Search;
