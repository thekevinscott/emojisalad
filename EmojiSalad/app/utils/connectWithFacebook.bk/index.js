import React, { Component } from 'react';
import { connect } from 'react-redux';
//import graphRequest from './graphRequest';
import getWrappedComponent from '../getWrappedComponent';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Login from 'pages/Login';
import Authentication from 'components/Authentication';

import {
  View,
  //Text,
} from 'react-native';

const permissions = [
  "email",
  "user_friends",
];

const connectWithFacebook = (...args) => component => {
  const WrappedComponent = getWrappedComponent(component, args);

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Authentication);
};

export default connectWithFacebook;
