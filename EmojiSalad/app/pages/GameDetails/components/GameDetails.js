import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GameSettings from 'components/GameSettings';

import {
  mapStateToProps,
  mapDispatchToProps,
} from '../selectors';

class GameDetails extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      inviteToGame: PropTypes.func.isRequired,
    }).isRequired,
    me: PropTypes.object.isRequired,
    game: PropTypes.shape({
      key: PropTypes.string.isRequired,
    }).isRequired,
    pending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(player) {
    this.props.actions.inviteToGame(this.props.me, player);
  }

  render() {
    return (
      <GameSettings
        onChange={this.onChange}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameDetails);
