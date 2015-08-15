import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';


export var Players = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query) {
      auth.isLoggedIn(transition);
    }
  },
  getInitialState: function() {
    return {
      loading: true,
      players: []
    };
  },
  url: '/api/players',
  componentDidMount: function() {
    reqwest({
      url: this.url,
      method: 'get'
    })
    .then(function (resp) {
      if ( resp.error ) {
        this.setState({
          loading: false,
          error: resp.error
        });
      } else {
        this.setState({
          loading: false,
          players: resp
        });
      }
    }.bind(this));
  },
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var players = this.state.players.map(function(player) {
        return (
          <tr><td>{player.number}</td><td>{player.last_contacted}</td><td>{player.created}</td></tr>
        );
      });
      content = (<table><thead><tr><td>Number</td><td>Last Contacted</td><td>Created</td></tr></thead>{players}</table>);
    }
    return (
      <div className="players page">
      {content}
      </div>
    );
  }
});

