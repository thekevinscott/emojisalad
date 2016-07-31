import {
  selectMe,
} from '../App/selectors';

import {
  fetchMessages,
  incrementPage,
} from './actions';

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
  return new Date(b.timestamp) - new Date(a.timestamp);
}
//function sortByNewest(a, b) {
  //return new Date(a.timestamp) - new Date(b.timestamp);
//}
//const getGame = (state, props) => state.data.games[props.game.key];
//const getMessages = (state) => state.data.messages;

export const makeSelectMessages = () => {
  const messagesPerPage = 20;
  return (game, messages, page) => {
    console.log('incoming page', page);
    //console.log('select messages for', game);
    return game.messages.map(key => {
      return {
        key,
        ...messages[key],
      };
    }).sort(sortByOldest).slice(0, messagesPerPage * page);
  };
};

export function makeMapStateToProps() {
  const selectMessages = makeSelectMessages();
  return (state, props) => {
    const gameKey = props.game.key;
    const game = state.data.games[gameKey];

    return {
      game,
      messages: selectMessages(game, state.data.messages, state.ui.Game.pages[gameKey]),
      me: selectMe(state),
    };
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fetchMessages: (userKey, gameKey, messageKeysToExclude) => {
        return dispatch(fetchMessages(userKey, gameKey, messageKeysToExclude));
      },
      incrementPage: (gameKey) => {
        return dispatch(incrementPage(gameKey));
      },
    },
  };
}

