import React, { Component } from 'react';
import Pusher from 'pusher-js/react-native';

import {
  AppRegistry,
  View,
  //Text,
} from 'react-native';

import {
  getStore,
} from '../utils/storage';
import configureStore from './configureStore';

import {
  App,
  Loading,
} from '../modules/App';

import ReactNativeUA from 'react-native-ua'; // import module

const style = {
  flex: 1,
};

class EmojiSalad extends Component {
  constructor(props) {
    super(props);
    //ReactNativeUA.enable_notification(); // prompt user to enable notification
  }

  componentWillMount() {
    this.setState({
      store: null,
    });

    this.getStore();

    //ReactNativeUA.on_notification((notification) => {
      //console.log('notification:',
                  //notification.platform,
                  //notification.event,
                  //notification.alert,
                  //notification.data);

                  //alert(notification.alert);
    //});
  }

  getStore() {
    return getStore().then(initialState => {
      this.setState({
        store: configureStore(initialState),
      });
    }).catch(err => {
      this.setState({
        store: configureStore({}),
      });
      console.log('Error getting initial state', err);
    });
  }

  renderApp() {
    if (this.state.store) {
      return (
        <App store={this.state.store} />
      );
    }

    return (<Loading />);
  }

  render() {
    return (
      <View style={style}>
        {this.renderApp()}
      </View>
    );
  }
}

AppRegistry.registerComponent('EmojiSalad', () => EmojiSalad);


/*
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher('64297db42152849faef9', {
  encrypted: true,
});

const channel = pusher.subscribe('test_channel');
pusher.subscribe('fuck_all');
channel.bind('my_event', function(data) {
  alert(data.message);
});
*/
