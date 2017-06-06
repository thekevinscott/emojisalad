import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import {
  //Text,
  View,
  //ListView,
  //PushNotificationIOS,
  //RefreshControl,
} from 'react-native';

import * as styles from '../styles';

import Friends from './Body/Friends';
import Search from './Search';

export const FriendPropType = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  name: PropTypes.string.isRequired,
});

export const FriendsPropTypes = {
  friends: PropTypes.arrayOf(FriendPropType).isRequired,
  invitableFriends: PropTypes.arrayOf(FriendPropType).isRequired,
};

const getContacts = (arr = [], search = '') => {
  if (search === '') {
    return arr;
  }

  return arr.filter(checkContact(search));
};

const isMatch = (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) === 0;

const checkContact = search => ({
  name = '',
  nickname = '',
}) => [
  name,
  nickname,
].reduce((found, val) => found || isMatch(val, search), false);

class InvitePlayers extends Component {
  static propTypes = {
    addPlayer: PropTypes.func.isRequired,
    fetching: PropTypes.bool.isRequired,
    ...FriendsPropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };

    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(search) {
    this.setState({
      ...this.state,
      search,
    });
  }

  render() {
    const {
      addPlayer,
      fetching,
    } = this.props;

    const friends = getContacts(this.props.friends, this.state.search);
    const invitableFriends = [];
    //const invitableFriends = getContacts(this.props.invitableFriends, this.state.search);

    return (
      <View
        style={styles.newGame}
      >
        <Search
          onChange={this.onSearch}
          onCancel={() => {
            Actions.pop();
          }}
        />
        <Friends
          fetching={fetching}
          friends={friends}
          invitableFriends={invitableFriends}
          addPlayer={addPlayer}
        />
      </View>
    );
  }
}

export default InvitePlayers;
