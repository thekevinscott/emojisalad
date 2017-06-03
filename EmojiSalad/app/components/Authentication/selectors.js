import {
  localLogin,
  localLogout,
  serverLogin,
} from './actions';

export const mapStateToProps = ({ data, ui }) => {
  return {
    me: data.me,
    credentials: ui.Authentication.credentials,
    isLoggedIn: ui.Authentication.isLoggedIn,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    actions: {
      localLogin: (credentials) => {
        return dispatch(localLogin(credentials));
      },
      localLogout: () => {
        return dispatch(localLogout());
      },
      serverLogin: (...args) => {
        return dispatch(serverLogin(...args));
      },
    },
  };
};

