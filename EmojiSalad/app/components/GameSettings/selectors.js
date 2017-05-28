import { Actions, } from 'react-native-router-flux';

import {
  updateGame,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    me: state.data.me,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      updateGame: (game, params) => {
        dispatch(updateGame(game, params));
      },
      invitePlayer: () => {
        Actions.invite();
      },
    },
  };
};
