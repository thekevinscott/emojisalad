import { Component } from 'react';
import { connect } from 'react-redux';
import {
  PushNotificationIOS,
} from 'react-native';

import {
  updateToken,
} from './actions';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      updateToken: token => {
        dispatch(updateToken(token));
      },
    },
  };
}

class PushNotificationListeners extends Component {
  constructor(props) {
    super(props);
    this.onRegister = this.onRegister.bind(this);
  }

  componentDidMount() {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', this.onRegister);
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegister);
  }

  onRegister(token) {
    this.props.actions.updateToken(token);
  }

  render() {
    return this.props.children;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PushNotificationListeners);
