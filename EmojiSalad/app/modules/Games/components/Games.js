/**
 * @flow
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  Text,
  View,
  TouchableHighlight,
  ListView,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import * as styles from '../styles';

import {
  fetchGames,
} from '../actions';

import {
  fetchMessages,
} from '../../Game/actions';

import {
  selectGames,
  selectUI,
} from '../selectors';

import {
  selectMe,
} from '../../App/selectors';

function mapStateToProps(state) {
  return {
    games: selectGames(state),
    me: selectMe(state),
    ui: selectUI(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    actions: {
      fetchGames: (userKey) => {
        return dispatch(fetchGames(userKey));
      },
      fetchMessages: (userKey) => {
        //return dispatch(fetchMessages(userKey));
      },
    },
  };
}

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

class Games extends Component {
  componentWillMount() {
    this.props.actions.fetchGames(this.props.me.key);
    //this.props.actions.fetchMessages(this.props.me.key);
  }

  _renderRow(game, sectionId, rowId, highlightRow) {
    const players = game.players.map(player => `${player.avatar} ${player.nickname}`).join(', ');

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
    console.log(this.props);
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={this.props.ui.fetching} />
        <ListView
          dataSource={this.getGames()}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeperator}
          style={styles.container}
        />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Games);
