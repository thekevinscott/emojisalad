//import { bindActionCreators } from 'redux'
import {
  selectMe,
} from 'components/App/selectors';

import {
  inviteToGame,
} from './actions';

const toArr = (obj = {}) => Object.keys(obj).reduce((arr, key) => arr.concat({
  ...obj[key],
  key,
}), []);

export function mapStateToProps(state, { game }) {
  const me = selectMe(state);
  const savingInvites = toArr((state.ui.GameDetails[game.key] || {}).pendingInvites);
  const invites = toArr(state.data.invites);

  const players = savingInvites.map(invite => {
    return {
      ...invite,
      status: 'saving',
    };
  }).concat(invites.map(invite => {
    return {
      ...state.data.users[invite.invited_user],
      status: 'pending',
    };
  }));

  return {
    me,
    players,
  };
}

export function mapDispatchToProps(dispatch, { game }) {
  return {
    actions: {
      inviteToGame: (me, player) => {
        return dispatch(inviteToGame(me.key, game, player));
      },
    },
  };
}
