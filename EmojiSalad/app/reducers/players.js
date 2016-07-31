import typeToReducer from 'type-to-reducer';

// TODO: Fix this import (should pull from index)
import {
  FETCH_GAMES,
} from '../modules/Games/types';

const initialState = {};

export default typeToReducer({
  [FETCH_GAMES]: {
    FULFILLED: (state, action) => {
      return state;
      //return {
        //...state,
        //...action.payload.reduce((gameObj, game) => ({
          //...gameObj,
          //...game.players.reduce((obj, player) => ({
            //...obj,
            //[player.id]: {
              //id: player.id,
              //created: player.created,
              //archived: player.archived,
              //to: player.to,
              //user_id: player.user_id,
            //},
          //}), {}),
        //}), {}),
      //};
    },
  },
}, initialState);
