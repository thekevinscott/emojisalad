import {
  updateUser,
} from './actions';

export const mapStateToProps = (state) => {
  return {
    me: state.data.me,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (form, me) => {
      return dispatch(updateUser(form, me));
    },
  };
};
