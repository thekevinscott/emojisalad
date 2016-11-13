import {
  selectStatus,
} from 'utils/Api/websocket/selectors';

export function mapStateToProps(state) {
  return {
    status: selectStatus(state),
  };
}

export function mapDispatchToProps() {
  return {};
}
