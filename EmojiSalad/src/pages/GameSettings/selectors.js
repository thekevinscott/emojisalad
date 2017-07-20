import {
  //startGame,
  saveGame,
} from './actions';

export function mapStateToProps(state) {
  const me = state.data.me;
  //const pending = state.ui.NewGame.pending;

  return {
    me,
    //pending,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      saveGame: (game, params) => {
        dispatch(saveGame(game, params));
      },
    },
  };
}
