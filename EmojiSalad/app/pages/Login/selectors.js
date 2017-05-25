import {
  login,
  next,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    user: state.ui.Login.user,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    next,
    login: (data) => {
      return dispatch(login(data));
    },
  };
};
