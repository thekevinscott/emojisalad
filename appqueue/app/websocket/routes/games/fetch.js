import getUserGames from '../../games/getUserGames';
import getUserInvites from '../../invites/getUserInvites';
import fetchMessagesForGames from '../../messages/fetchMessagesForGames';
import fetchTotalMessagesForGames from '../../messages/fetchTotalMessagesForGames';

const fetchMessages = ({
  userKey,
  gameKeys,
}) => {
  return Promise.all([
    fetchTotalMessagesForGames(userKey, gameKeys),
    fetchMessagesForGames(userKey, gameKeys, { limit: 1 }),
  ]).then(response => {
    const totalMessages = response[0];
    const messages = response[1];
    return {
      messages,
      totalMessages,
    };
  });
};

const getAllGamesForUser = userKey => {
  return getUserGames(userKey).then(games => {
    console.info('fetchGames, games for user', userKey, games);
    return games.map(game => ({
      key: game.key,
      created: game.created,
      players: game.players,
      //round: game.round,
      round_count: game.round_count,
    }));
  }).then(games => {
    const gameKeys = games.map(game => game.key);
    return fetchMessages({
      userKey,
      gameKeys,
    }).then(({
      totalMessages,
      messages,
    }) => {
      console.info('fetchGames, messages', messages, totalMessages);
      return games.map(game => ({
        ...game,
        messages: messages[game.key],
        total_messages: totalMessages[game.key],
      }));
    });
  });
};

const getAllInvitesForUser = userKey => {
  return getUserInvites(userKey).then(invites => {
    console.info('fetchGames, invites', invites);
    const gameKeys = invites.map(invite => invite.game.key);
    return fetchMessages({
      userKey,
      gameKeys,
    }).then(({
      totalMessages,
      messages,
    }) => {
      //const invitesByGame = invites.reduce((obj, invite) => {
        //return {
          //...obj,
          //[invite.game.key]: invite,
        //};
      //}, {});

      return invites.map(invite => ({
        ...invite,
        messages: messages[invite.game.key],
        total_messages: totalMessages[invite.game.key],
      }));
    });
  });
};

const addType = (arr, type) => arr.map(el => ({ type, ...el }));

export default function fetchGames(ws, { userKey }) {
  if (! userKey) {
    return new Promise((resolve, reject) => {
      reject('You must provide a user key');
    });
  }

  const promises = [
    getAllGamesForUser(userKey),
    getAllInvitesForUser(userKey),
  ];

  return Promise.all(promises).then(response => {
    return {
      games: response[0],
      invites: response[1],
    };
  }).then(({
    games,
    invites,
  }) => {
    return addType(games, 'game').concat(addType(invites, 'invite'));
  }).then(rows => {
    // still need to sort it
    return rows;
  });
}
