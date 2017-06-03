import typeToReducer from 'type-to-reducer';

//import translateTimestampFromDatabase from 'app/utils/translateTimestampFromDatabase';

import {
  FETCH_GAMES,
  CONFIRM_INVITE,
  CANCEL_INVITE,
} from 'app/pages/Games/types';

import {
  INVITE_TO_GAME,
} from 'app/pages/GameDetails/types';

//import {
  //RECEIVE_MESSAGE,
//} from 'app/pages/Game/types';

export const initialState = {};

const initialInvite = {
  invited_user: {},
  inviter_player: {},
  game: {},
};

function translateInvite(stateInvite = initialInvite, invite = initialInvite) {
  return {
    key: invite.key || stateInvite.key,
    game: invite.game.key || stateInvite.game.key,
    used: invite.used || stateInvite.used,
    //id: invite.id || stateInvite.id,
    invited_user: invite.invited_user.key || stateInvite.invitedUser.key,
    inviter_player: invite.inviter_player.key || stateInvite.inviter_player.key,
  };
}

const omitKey = (state, { meta }) => {
  return Object.keys(state).reduce((obj, key) => {
    if (key === meta.invite.key) {
      return obj;
    }

    return {
      ...obj,
      [key]: state[key],
    };
  }, {});
};

export default typeToReducer({
  [INVITE_TO_GAME]: {
    //PENDING: (state, action) => {
      //return state;
    //},
    FULFILLED: (state, {
      data,
      meta: {
        gameKey,
      },
    }) => {
      return data.reduce((invites, invite) => {
        if (invite.error) {
          return invites;
        }
        const key = invite.key;

        const newInvite = {
          ...invite,
          game: { key: gameKey },
        };

        console.log('new invite', newInvite);

        return {
          ...invites,
          [key]: translateInvite(invites[key], newInvite),
        };
      }, state);
    },
  },
  [CONFIRM_INVITE]: {
    FULFILLED: omitKey,
  },
  [CANCEL_INVITE]: {
    FULFILLED: omitKey,
  },
  [FETCH_GAMES]: {
    FULFILLED: (state, { data }) => {
      return data.reduce((obj, row) => {
        if (row.type === 'invite') {
          return {
            ...obj,
            [row.key]: translateInvite(state[row.key], row),
          };
        }

        return {
          ...obj,
          ...row.invites.reduce((gameInvites, invite) => {
            return {
              ...gameInvites,
              [invite.key]: translateInvite(state[invite.key], {
                ...invite,
                game: row,
              }),
            };
          }, {}),
        };
      }, state);
    },
  },
  //[RECEIVE_MESSAGE]: {
    //FULFILLED: (state, { data }) => {
      //console.log('handle this ****** invite reducer ', data);
      //if (data.messageKey === 'invite') {
        //const key = 'unknown';
        //return {
          //...state,
          //[key]: translateInvite(state[key], data),
        //};
      //}

      //return state;
    //},
  //},
}, initialState);
