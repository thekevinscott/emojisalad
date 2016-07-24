/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as styles from './styles';

import {
  fetchGames,
} from './actions';

import {
  selectGames,
} from './selectors';

function mapStateToProps(state) {
  return {
    games: selectGames(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: {
      fetchGames: () => {
        return dispatch(fetchGames(ownProps.me));
      },
    },
  };
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

class Games extends Component {
  componentWillMount() {
    this.props.actions.fetchGames();
  }

  _renderRow(game, sectionId, rowId, highlightRow) {
    const players = game.players.map(player => player.nickname).join(', ');

    return (
      <TouchableHighlight
        onPress={() => {
          Actions.game({
            game,
          });
        }}
        key={`${rowId}`}
      >
        <View
          style={styles.row}
        >
          <Text style={styles.rowText}>
            {players}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSeperator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={styles.rowSeparator(adjacentRowHighlighted)}
      />
    );
  }

  getGames() {
    return ds.cloneWithRows(this.props.games);
  }

  render() {
    return (
      <ListView
        dataSource={this.getGames()}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeperator}
        style={styles.container}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Games);
