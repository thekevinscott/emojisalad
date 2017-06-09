//import { bindActionCreators } from 'redux'

import {
  //invite,
  //getUserFriends,
} from './actions';

const selectContacts = (contacts, game = { players: [], invites: [], }) => {
  const gamePlayers = game.players.map(player => player.key);
  const pendingInvites = game.invites.map(invite => invite.invited_user);
  const exclude = gamePlayers.concat(pendingInvites);

  return Object.keys(contacts).map(id => {
    return contacts[id];
  }).sort((a, b) => {
    return a.order - b.order;
  }).filter(contact => {
    return exclude.indexOf(contact.key) === -1;
  });
};

export const getContacts = (arr = [], search = '') => {
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

export function mapStateToProps(state, { game }) {
  const me = state.data.me;

  const {
    fetching,
  } = state.ui.Invite;

  return {
    me,
    friends: selectContacts(me.contacts.friends, game),
    //invitableFriends: selectContacts(invitableFriends, game),
    invitableFriends: [],
    fetching,
  };
}

export function mapDispatchToProps() {
  return {
    actions: {
      //invite: bindActionCreators(invite, dispatch),
      //getUserFriends: bindActionCreators(getUserFriends, dispatch),
    },
  };
}

