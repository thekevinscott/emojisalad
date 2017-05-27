import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import Form from 'components/Form';
import AvatarPicker from './AvatarPicker';

const fields = [
  {
    name: 'nickname',
    label: "Your Nickname",
    spellCheck: false,
    required: true,
  },
  {
    name: 'number',
    label: "Your Phone Number (optional)",
  },
  {
    name: 'avatar',
    label: "Your Emoji Avatar",
    component: AvatarPicker,
  }
];

const getIsReadyForSubmission = (form) => fields.reduce((isReady, field, index) => {
  if (isReady === false) {
    return false;
  }

  if (field.required) {
    return (form[index] || '').trim() !== '';
  }

  return isReady;
}, true);

const getValues = (user = {}) => {
  return fields.reduce((values, field) => {
    return values.concat(user[field.name]);
  }, []);
};

class Settings extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      values: getValues(props.user),
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(form) {
    if (this.props.onChange) {
      const values = fields.reduce((obj, field, index) => {
        return {
          ...obj,
          [field.name]: form[index],
        };
      }, {});
      this.props.onChange(getIsReadyForSubmission(form), values);
    }

    this.setState({
      ...this.state,
      values: fields.reduce((arr, field, index) => {
        const value = form[index] !== undefined ? form[index] : this.state.values[index];
        return arr.concat(value);
      }, []),
    });
  }

  render() {
    const values = this.state.values;

    return (
      <Form
        fields={fields}
        onChange={this.onChange}
        values={values}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
