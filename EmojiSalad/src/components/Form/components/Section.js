import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import * as styles from '../styles';

class Section extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    returnKeyType: PropTypes.string.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
    _ref: PropTypes.func.isRequired,
    blurOnSubmit: PropTypes.bool.isRequired,
    onChangeText: PropTypes.func.isRequired,
    spellCheck: PropTypes.string,
    value: PropTypes.any,
    component: PropTypes.any,
  };

  render() {
    const {
      label,
      returnKeyType,
      _ref,
      onSubmitEditing,
      blurOnSubmit,
      onChangeText,
      spellCheck,
      value,
      component,
    } = this.props;

    const Component = component || TextInput;

    return (
      <TouchableOpacity
        style={styles.section}
        onPress={() => {
          if (this.input) {
            this.input.focus();
          }
        }}
      >
        <Text
          style={styles.label}
        >
          { label.toUpperCase() }
        </Text>
        <Component
          value={value ? value : undefined}
          spellCheck={ spellCheck !== undefined ? spellCheck : true }
          blurOnSubmit={ blurOnSubmit }
          style={styles.input}
          returnKeyType={returnKeyType}
          ref={_ref}
          onSubmitEditing={onSubmitEditing}
          onChangeText={onChangeText}
        />
      </TouchableOpacity>
    );
  }
}

export default Section;
