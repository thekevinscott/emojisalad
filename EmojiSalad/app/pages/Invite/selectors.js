import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  //invite,
  getUserFriends,
} from './actions';

const selectContacts = (contacts, game = { players: [] }) => {
  console.log(contacts, game);
  const gamePlayers = game.players.map(player => player.key);
  return contacts.filter(contact => {
    return gamePlayers.indexOf(contact.key) === -1;
  });
};

export function mapStateToProps(state, { game }) {
  const me = selectMe(state);
  const {
    friends,
    invitableFriends,
    fetching,
  } = state.ui.Invite;

  return {
    me,
    friends: selectContacts(friends, game),
    invitableFriends: selectContacts(invitableFriends, game),
    fetching,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      //invite: bindActionCreators(invite, dispatch),
      getUserFriends: bindActionCreators(getUserFriends, dispatch),
    },
  };
}

