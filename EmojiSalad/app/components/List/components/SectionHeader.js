import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Text,
} from 'react-native';

import * as styles from '../styles';

const getBody = (data, children) => {
  if (children) {
    return children;
  }

  return (
    <Text style={styles.sectionHeaderText}>
      { data }
    </Text>
  );
}

const SectionHeader = ({
  data,
  children,
}) => {
  return (
    <View
      style={styles.sectionHeader}
    >
      {getBody(data, children)}
    </View> 
  );
}

SectionHeader.propTypes = {
  data: PropTypes.string,
  children: PropTypes.node,
};

export default SectionHeader;
