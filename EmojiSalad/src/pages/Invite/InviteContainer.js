import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getContacts,
  mapStateToProps,
  mapDispatchToProps,
} from './selectors';

import Invite from './components/Invite';
import { FriendsPropTypes } from './components/propTypes';


class InviteContainer extends Component {
  static propTypes = {
    me: PropTypes.shape({
      key: PropTypes.string.isRequired,
      facebookToken: PropTypes.string.isRequired,
    }).isRequired,
    fetching: PropTypes.bool.isRequired,
    addPlayer: PropTypes.func.isRequired,
    gameKey: PropTypes.string,
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
    const friends = getContacts(this.props.friends, this.state.search);
    const invitableFriends = [];
    //const invitableFriends = getContacts(this.props.invitableFriends, this.state.search);

    return (
      <Invite
        onSearch={this.onSearch}
        fetching={this.props.fetching}
        friends={friends}
        invitableFriends={invitableFriends}
        addPlayer={this.props.addPlayer}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteContainer);

