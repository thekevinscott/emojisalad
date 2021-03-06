import {
  FETCH_GAMES,
  OPEN_GAME,
  UPDATE_STARTING_MESSAGE,
  PAUSE_GAME,
  LEAVE_GAME,
  CONFIRM_INVITE,
  CANCEL_INVITE,
} from './types';

export function fetchData(userKey) {
  return dispatch => {
    return dispatch({
      type: FETCH_GAMES,
      payload: {
        userKey,
      },
    });
  };
}

export function openGame(game, games) {
  return dispatch => {
    debugger;
    //Actions.game({
      //game,
    //});

    dispatch({
      type: OPEN_GAME,
      game,
      games,
    });
  };
}

export function updateStartingMessage(game) {
  return {
    type: UPDATE_STARTING_MESSAGE,
    game,
  };
}

export const pauseGame = (user, game) => dispatch => dispatch(() => {
  return dispatch({
    type: PAUSE_GAME,
    payload: {
      userKey: user.key,
      gameKey: game.key,
    },
  });
});

export const leaveGame = (user, game) => dispatch => dispatch(() => {
  return dispatch({
    type: LEAVE_GAME,
    payload: {
      userKey: user.key,
      gameKey: game.key,
    }
  });
});

const inviteAction = type => (userKey, invite) => dispatch => {
  return dispatch({
    type,
    meta: {
      invite,
    },
    payload: {
      userKey,
      gameKey: invite.game,
    }
  });
};

export const confirmInvite = inviteAction(CONFIRM_INVITE);
export const cancelInvite = inviteAction(CANCEL_INVITE);
