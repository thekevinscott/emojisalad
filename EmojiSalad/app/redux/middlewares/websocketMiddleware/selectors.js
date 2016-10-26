import {
  updateStatus,
} from './actions';

export function mapStateToProps() {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateStatus: status => {
      return dispatch(updateStatus(status));
    },
  };
}
