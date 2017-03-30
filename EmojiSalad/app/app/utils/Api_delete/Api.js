window.navigator.userAgent = 'ReactNative';
import { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client/socket.io';

import {
  API_PORT,
  API_HOST,
} from '../../../config';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';
class Api extends Component {
  componentDidMount() {
    console.log('Api comp did mount');
    const socket = io(`${API_HOST}:${API_PORT}`, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('connected!');
      this.props.updateStatus(true);
    });
    socket.on('disconnect', () => {
      console.log('disconnected!');
      this.props.updateStatus(false);
    });
  }

  render() {
    return this.props.children;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Api);
