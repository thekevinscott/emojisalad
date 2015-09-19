import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';

import { Base } from '../base';

export var Players = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/players',
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var players = this.state.data.map(function(player) {
        return (
          <tr><td>{player.number}</td><td>{player.created}</td><td>x</td></tr>
        );
      });
      content = (<table><thead><tr><td>Number</td><td>Created</td><td>Delete</td></tr></thead>{players}</table>);
    }
    return (
      <div className="players page">
      {content}
      </div>
    );
  }
});

