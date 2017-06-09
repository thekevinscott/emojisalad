import {
  localLogin,
  localLogout,
  serverLogin,
} from 'core/redux/middlewares/authenticationMiddleware/actions';

export const mapStateToProps = ({ data, application }) => {
  return {
    me: data.me,
    credentials: application.authentication.credentials,
    isLoggedIn: application.authentication.isLoggedIn,
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

