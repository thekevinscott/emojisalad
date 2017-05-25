import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import * as styles from '../styles';

import Section from './Section';

class Form extends Component {
  static propTypes = {
    fields: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      spellCheck: PropTypes.bool,
      component: PropTypes.any,
    })).isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.focusNextField = this.focusNextField.bind(this);
    this.getInput = this.getInput.bind(this);
    this.onChangeText = this.onChangeText.bind(this);

    this.inputs = {};
    this.form = {};
  }

  getInput(key) {
    return input => {
      this.inputs[key] = input;
    }
  }

  focusNextField(key) {
    if (this.inputs[key]) {
      this.inputs[key].focus();
    }
  }

  onChangeText(key, e) {
    this.form = {
      ...this.form,
      [key]: e,
    };

    if (this.props.onChange) {
      this.props.onChange(this.form);
    }
  }

  render() {
    const {
      fields,
    } = this.props;

    return (
      <View style={styles.container}>
        {fields.map((field, key) => {
          const isLast = key === fields.length - 1;
          const returnKeyType = isLast ? 'done' : 'next';
          return (
            <Section
              key={key}
              label={field.label}
              component={field.component}
              returnKeyType={returnKeyType}
              onSubmitEditing={() => {
                this.focusNextField(key + 1);
              }}
              _ref={this.getInput(key)}
              blurOnSubmit={isLast ? false : true }
              value={this.props.values[key]}
              onChangeText={e => {
                this.onChangeText(key, e);
              }}
            />
          );
        })}
      </View>
    );
  }
}

export default Form;
