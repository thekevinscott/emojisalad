import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import graphRequest from './graphRequest';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Login from 'pages/Login';
//import {
  //Actions,
//} from 'react-native-router-flux';

const permissions = [
  "email",
  "user_friends",
];

import * as styles from '../styles';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

import {
  View,
} from 'react-native';

class Authentication extends Component {
  static propTypes = {
    me: PropTypes.shape({
      key: PropTypes.string,
      registered: PropTypes.number.isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      localLogin: PropTypes.func.isRequired,
      localLogout: PropTypes.func.isRequired,
      serverLogin: PropTypes.func.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
    credentials: PropTypes.object,
    isLoggedIn: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.refHandler = this.refHandler.bind(this);
    this.onExistingLoginFound = this.onExistingLoginFound.bind(this);
    this.login = this.login.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onLoginNotFound = this.onLoginNotFound.bind(this);

    this.state = {
      loggedIn: false,
    };
  }

  refHandler(c) {
    if (c) {
      this.instance = c.getWrappedInstance();
    }
  }

  // an existing login was found
  onExistingLoginFound(data) {
    this.login(data);
  }

  onLogin(data) {
    this.login(data);
  }

  login({ credentials }) {
    this.props.actions.localLogin(credentials);
  }

  onLogout() {
    this.setState({
      loggedIn: false,
    });
    this.props.actions.localLogout();
  }

  onLoginNotFound() {
    this.onLogout();
  }

  componentWillReceiveProps(nextProps) {
    const {
      isLoggedIn,
      credentials,
      actions: {
        serverLogin,
      },
    } = nextProps;

    if (isLoggedIn === true && !this.state.loggedIn) {
      this.setState({
        loggedIn: true,
      });
      serverLogin(credentials);
    }
  }

  render() {
    const {
      me,
      //isLoggedIn,
    } = this.props;

    //const opacity = isLoggedIn ? 0 : 1;
    const opacity = me.key ? 0 : 1;

    return (
      <View style={styles.container}>
        <View
          style={{
            opacity,
            ...styles.login,
          }}
        >
          <Login>
            <FBLogin
              permissions={permissions}
              loginBehavior={FBLoginManager.LoginBehaviors.Native}
              onLogin={this.onLogin}
              onLogout={this.onLogout}
              onLoginFound={this.onExistingLoginFound}
              onLoginNotFound={this.onLoginNotFound}
              onError={() => {
                //console.log("ERROR");
                //console.log(data);
              }}
              onCancel={() => {
                //console.log("User cancelled.");
              }}
              onPermissionsMissing={() => {
                //console.log("Check permissions!");
                //console.log(data);
              }}
            />
          </Login>
        </View>
        {this.state.loggedIn && this.props.children}
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Authentication);
