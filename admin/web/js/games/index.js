//require("./games.less");
import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

//import { auth } from '../auth';

import { Base } from '../base';
const Link = Router.Link;

export const Games = React.createClass({
  mixins: [Base], // Use the mixin
  url: api.games.get.endpoint,
  render: function() {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const games = this.state.data.map((game) => {
        const nicknames = game.players.map((player) => {
          return player.nickname;
        }).join(', ');
        return (
          <tr><td><Link to="game" params={{game_id: game.id}}>{game.id}</Link></td><td>{game.created}</td><td>{nicknames}</td></tr>
        );
      });
      content = (<table><thead><tr><td>ID</td><td>Created</td><td>Players</td></tr></thead>{games}</table>);
    }
    return (
      <div className="games page">
      {content}
      </div>
    );
  }
});

export const Game = React.createClass({
  mixins: [Base], // Use the mixin
  url: function() {
    return `${api.games.get.endpoint}/${this.props.params.game_id}`;
  },
  componentWillMount: function() {
    reqwest({
      url: `${api.games.get.endpoint}/${this.props.params.game_id}/messages`,
      method: 'get'
    }).then(function(messages) {
      this.setState({
        messages
      });
    }.bind(this));
  },
  render: function() {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const phones = this.state.data.players.map(function(player) {
        let messages;
        if ( this.state.messages && this.state.messages[player.nickname] && this.state.messages[player.nickname].length ) {
          console.log(this.state.messages);
          messages = this.state.messages[player.nickname].map((message) => {
            const className = `message ${message.type}`;
            return (
              <div className={className}>
                {message.body}
              </div>
            );
            return message;
          });
        }
        return (
          <div className="phone">
            {messages}
          </div>
        );
      }.bind(this));
      content = (
        <div className="game-container">
          <div className="stats">
            <div className="game-stats">
              <p>Created: {this.state.data.created}</p>
              <p>Players: {this.state.data.players.length}</p>
            </div>
            <div className="round-stats">
              <p>Phrase: {this.state.data.round.phrase}</p>
              <p>Submission: {this.state.data.round.submission}</p>
              <p>Submitter: {this.state.data.round.submitter.nickname}</p>
              <p>Started: {this.state.data.round.submitter.created}</p>
              <p>Last Activity: {this.state.data.round.submitter.last_activity}</p>
            </div>
          </div>
          <div className="messages">
            {phones}
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
