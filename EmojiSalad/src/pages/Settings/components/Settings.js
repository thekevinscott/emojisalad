import React from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import LogoutButton from './LogoutButton';
import Form from 'components/Form';

import * as styles from '../styles';

const Settings = ({
  onChange,
  values,
  fields,
}) => {
  return (
    <View style={styles.container}>
      <Form
        fields={fields}
        onChange={onChange}
        values={values}
      />
      <LogoutButton />
    </View>
  );
}

Settings.propTypes = {
  onChange: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    spellCheck: PropTypes.bool,
    required: PropTypes.bool,
    component: PropTypes.func,
  })).isRequired,
  values: PropTypes.array.isRequired,
};

export default Settings;
