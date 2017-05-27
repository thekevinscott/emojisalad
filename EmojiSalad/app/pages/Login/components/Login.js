import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  Text,
  //TextInput,
  View,
  //Animated,
} from 'react-native';

import * as styles from '../styles';

const permissions = [
  "email",
  "user_friends",
];

class Login extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      login: PropTypes.func.isRequired,
      next: PropTypes.func.isRequired,
      //sendDeviceInfo: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.object,
    state: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onLoginFound = this.onLoginFound.bind(this);
    this.login = this.login.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      console.log('we have logged in with user', nextProps.user);
      this.props.actions.next(nextProps.user);
    }
  }

  componentDidMount() {
  }

  onLoginFound(data) {
    console.log('data', data);
    this.login(data);
  }

  onLogin(data) {
    this.login(data);
  }

  login(data) {
    //this.props.actions.sendDeviceInfo(this.props.state);
    this.props.actions.login(data);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>😎</Text>
        <Text style={styles.logo}>Emoji Salad</Text>
        <View style={styles.facebookContainer}>
          <FBLogin
            ref={(fbLogin) => {
              this.fbLogin = fbLogin;
            }}
            permissions={permissions}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={this.onLogin}
            onLogout={function() {
              console.log("Logged out.");
              //this.setState({ user : null });
            }}
            onLoginFound={this.onLoginFound}
            onLoginNotFound={() => {
              console.log("No user logged in.");
              //this.setState({ user : null });
            }}
            onError={data => {
              console.log("ERROR");
              console.log(data);
            }}
            onCancel={() => {
              console.log("User cancelled.");
            }}
            onPermissionsMissing={data => {
              console.log("Check permissions!");
              console.log(data);
            }}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(Login);
