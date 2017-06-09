import { Component } from 'react';
import PropTypes from 'prop-types';
import OneSignal from 'react-native-onesignal';

export default class PushNotificationHandler extends Component {
  static propTypes = {
    savePushId: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.receivedPushToken = this.receivedPushToken.bind(this);
  }

  componentWillMount() {
    console.log('can this be moved out of the component into the raw javascript?');
    OneSignal.addEventListener('ids', this.receivedPushToken);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.receivedPushToken);
  }

  receivedPushToken({ pushToken, userId }) {
    this.props.savePushId(pushToken, userId);
  }

  render() {
    return this.props.children;
  }
}
