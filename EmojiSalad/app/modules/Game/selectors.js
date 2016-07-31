import {
  selectMe,
} from '../App/selectors';

//export function selectMyPlayer(state, gameId) {
  //const me = state.data.me;
  //const game = state.data.games[gameId];
  //const players = game.players.map(playerId => {
    //return state.data.players[playerId];
  //});
  //const player = players.filter(gamePlayer => gamePlayer.user_id === me.id)[0];
  //return state.data.players[player.id];
//}

export function selectMessages(state, messageKeys = []) {
  console.log('select messages', state, messageKeys);
  return messageKeys.map(key => {
    return {
      key,
      ...state.data.messages[key],
    };
  });
}

export function mapStateToProps(state, ownProps) {
  const game = state.data.games[ownProps.game.key];

  return {
    game,
    messages: selectMessages(state, game.messages),
    me: selectMe(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchMessages: (userId) => {
        //return dispatch(fetchMessages(userId));
      },
    },
  };
}

