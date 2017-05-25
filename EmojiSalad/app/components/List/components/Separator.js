import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import * as styles from '../styles';

const Separator = ({
  sectionID,
  rowID,
}) => (
  <View
    key={`${sectionID}-${rowID}`}
    style={styles.rowSeparator}
  />
);

Separator.propTypes = {
  sectionID: PropTypes.string.isRequired,
  rowID: PropTypes.string.isRequired,
};

export default Separator;
