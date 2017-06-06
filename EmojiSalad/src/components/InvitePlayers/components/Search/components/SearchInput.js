import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  TextInput,
} from 'react-native';

import { Search } from 'components/Icon';

import * as styles from '../styles';

const SearchInput = ({
  onChange,
}) => {
  return (
    <View
      style={styles.searchInput}
    >
      <Search
        size={15}
        color="#7E8E93"
      />
      <TextInput
        clearButtonMode="always"
        style={styles.searchInputText}
        placeholder="Search for a friend"
        onChangeText={onChange}
        autoFocus
      />
    </View>
  );
}

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchInput;

