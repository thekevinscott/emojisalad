//require("./games.less");
import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';

import { Base } from '../base';
var Link = Router.Link;

export var Games = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/games',
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var games = this.state.data.map(function(game) {
          return (
            <tr><td><Link to="game" params={{game_id: game.id}}>{game.id}</Link></td><td>{game.created}</td></tr>
                 );
      });
      
      content = (<table><thead><tr><td>ID</td><td>Created</td></tr></thead>{games}</table>);
    }
    return (
      <div className="games page">
      {content}
      </div>
    );
  }
});

export var Game = React.createClass({
  mixins: [Base], // Use the mixin
  url: function() {
    return '/api/games/'+this.props.params.game_id;
  },
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      console.log(this.state.data);
      var iframes = this.state.data.players.map(function(player) {
        var url = '//45.55.41.73:5003/api/user/'+player.id;
        return (
          <iframe src={url}></iframe>
        );
      });
      content = (
        <div className="game-container">
          <div className="game-stats">
            <p>State: {this.state.data.state}</p>
            <p>Created: {this.state.data.created}</p>
            <p>Players: {this.state.data.players.length}</p>
            <p>Rounds: {this.state.data.rounds}</p>
          </div>
          <div className="messages">
            {iframes}
          </div>
        </div>
      );
    }
    return (
      <div className="games page">
      {content}
      </div>
    );
  }
});
