import { bindActionCreators } from 'redux';
import {
  savePushId,
} from './actions';

export function selectMe({ data }) {
  return data.me;
}

export function selectGames({ data }) {
  return Object.keys(data.games).map(gameKey => {
    return data.games[gameKey];
  });
}

export function mapStateToProps() {
  return {};
}

export function mapDispatchToProps(dispatch) {
  return {
    actions: {
      savePushId: bindActionCreators(savePushId, dispatch),
    },
  };
}
