import React, { Component } from 'react';
import { Actions, } from 'react-native-router-flux';
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
    pending: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      invitedPlayers: {},
    };

    this.onChange = this.onChange.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  startGame() {
    if (!this.props.pending) {
      this.props.actions.startGame(this.props.me.key, this.state.invitedPlayers);
    }
  }

  componentWillMount() {
    Actions.refresh({
      rightTitle: 'Done',
      onRight: this.startGame,
    });
  }

  onChange(player) {
    this.setState({
      ...this.state.invitedPlayers,
      [player.id]: player,
    });
  }

  render() {
    return (
      <GameSettings
        game={{ players: [this.props.me] }}
        onChange={this.onChange}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGame);
