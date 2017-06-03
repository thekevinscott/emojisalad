import typeToReducer from 'type-to-reducer';

//import {
  //FB_API,
//} from 'middlewares/networkMiddleware/types';

//import {
  //GET_USER_FRIENDS,
//} from './types';

const initialState = {
  fetching: false,
  //friends: [],
  //invitableFriends: [],
};

//const translateFriend = friend => ({
  //...friend,
  //id: `${friend.id}`,
//});

//const handleGetUserFriends = (state, data) => {
  //return {
    //...state,
    //friends: data['me/friends'].data.map(translateFriend),
    //invitableFriends: data['me/invitable_friends'].data.map(translateFriend),
  //};
//};

export default typeToReducer({
  //[FB_API]: {
    //PENDING: (state, { meta }) => {
      //if (meta.type === GET_USER_FRIENDS) {
        //return {
          //...state,
          //fetching: true,
        //};
      //}

      //return state;
    //},
    //FULFILLED: (state, {
      //meta,
      //data,
    //}) => {
      //if (meta.type === GET_USER_FRIENDS) {
        //return {
          //...handleGetUserFriends(state, data),
          //fetching: false,
        //};
      //}

      //return state;
    //},
  //},
}, initialState);

