import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GameSettings from 'components/GameSettings';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class NewGame extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      startGame: PropTypes.func.isRequired,
    }).isRequired,
    me: PropTypes.object.isRequired,
  };

  render() {
    return (
      <GameSettings
        startGame={(players) => {
          this.props.actions.startGame(this.props.me.key, players);
        }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGame);
