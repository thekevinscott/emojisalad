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

function sortByOldest(a, b) {
  return new Date(a.timestamp) - new Date(b.timestamp);
}
//const getGame = (state, props) => state.data.games[props.game.key];
//const getMessages = (state) => state.data.messages;

export const makeSelectMessages = () => {
  return (game, messages) => {
    //console.log('select messages for', game);
    return game.messages.map(key => {
      return {
        key,
        ...messages[key],
      };
    }).sort(sortByOldest);
  };
};

export function makeMapStateToProps() {
  const selectMessages = makeSelectMessages();
  return (state, props) => {
    const game = state.data.games[props.game.key];

    return {
      game,
      messages: selectMessages(game, state.data.messages),
      me: selectMe(state),
    };
  };
}

export function mapDispatchToProps() {
  return {
    actions: {
      //fetchMessages: (userId) => {
        //return dispatch(fetchMessages(userId));
      //},
    },
  };
}

