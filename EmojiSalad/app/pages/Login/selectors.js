import {
  login,
  next,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    user: state.ui.Login.user,
    state,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      next,
      login: (data) => {
        return dispatch(login(data));
      },
    },
  };
};
