import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Text,
  View,
} from 'react-native';

import {
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';

const getText = messages => {
  return (messages || []).map(message => {
    if (typeof message === 'string') {
      return message;
    }

    const t = moment(message.timestamp);
    return `${t.format('HH:mm:ss.SSS a')}: ${message.message}`;
  }).join('\n\n');
};

class Logger extends Component {
  render() {
    //const text = getText(this.props.logger);
    const text = 'booyah';
    return (
      <View
        style={{
          padding: 20,
          backgroundColor: '#EEE',
          borderTopColor: '#CCCCCC',
          borderTopWidth: 1,
        }}
      >
        <Text>{text}</Text>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logger);
