import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';

import Settings from './components/Settings';
import SaveButton from './components/SaveButton';
import AvatarPicker from './components/AvatarPicker';

//const getIsReadyForSubmission = (form) => defaultFields.reduce((isReady, field, index) => {
  //if (isReady === false) {
    //return false;
  //}

  //if (field.required) {
    //return (form[index] || '').trim() !== '';
  //}

  //return isReady;
//}, true);

//const getValues = (user = {}, fields) => {
  //return fields.reduce((values, field) => {
    //return values.concat(user[field.name]);
  //}, []);
//};

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

class SettingsContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const updateSettings = params.updateSettings || function() {};
    return {
      title: 'Settings',
      headerRight: (
        <SaveButton
          handlePress={updateSettings}
        />
      ),
    };
  };

  static propTypes = {
    me: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
      updateSettings: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired,
    }).isRequired,
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      form: null,
    };

    this.onChange = this.onChange.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      updateSettings: this.updateSettings,
    });
  }

  updateSettings() {
    if (!this.props.pending) {
      this.props.actions.updateSettings(this.state.form, this.props.me).then(() => {
        this.props.navigation.navigate('Games');
      });
    }
  }

  onChange(readyForSubmission, form) {
    this.setState({
      form,
    });
  }

  render() {
    const {
      me,
    } = this.props;

    const values = [
      me.nickname,
      me.number,
      me.avatar,
    ];

    return (
      <Settings
        values={values}
        onChange={this.onChange}
        fields={fields}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsContainer);
