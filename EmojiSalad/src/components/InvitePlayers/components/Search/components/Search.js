import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import Cancel from './Cancel';
import SearchInput from './SearchInput';

import * as styles from '../styles';

const Search = ({
  onChange,
  onCancel,
}) => {
  return (
    <View style={styles.search}>
      <SearchInput 
        onChange={onChange}
      />
      <Cancel
        onCancel={onCancel}
      />
    </View>
  );
};

Search.propTypes = {
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Search;
