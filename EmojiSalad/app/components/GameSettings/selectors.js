import { Actions, } from 'react-native-router-flux';

export const mapStateToProps = (state) => {
  return {
    me: state.data.me,
  };
};

export const mapDispatchToProps = () => {
  return {
    actions: {
      invitePlayer: () => {
        Actions.invite();
      },
    },
  };
};
