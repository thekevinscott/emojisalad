//require("./games.less");
import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

//import { auth } from '../auth';

import { Base } from '../base';
const Link = Router.Link;

export const Games = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/games',
  render: function() {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      const games = this.state.data.reverse().map((game) => {
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
    return `/api/games/${this.props.params.game_id}`;
  },
  getMessages: function() {
    reqwest({
      url: `/api/games/${this.props.params.game_id}/messages`,
      method: 'get'
    }).then(function(messages) {
      this.setState({
        messages: Object.assign({}, this.state.messages, Object.keys(messages).reduce((obj, player) => {
          const current_messages = (this.state.messages && this.state.messages[player]) ? this.state.messages[player] : {};
          return Object.assign({}, obj, {
            [player]: Object.assign({}, current_messages, messages[player].reduce((messages_by_id, message) => {
              return Object.assign({}, messages_by_id, {
                [`${message.id}-${message.type}`]: message
              });
            }, {}))
          });
        }, {}))
      });
    }.bind(this));
  },
  getScore: function() {
    reqwest({
      url: `/api/games/${this.props.params.game_id}/score`,
      method: 'get'
    }).then(function(score) {
      this.setState({
        score
      });
    }.bind(this));
  },
  componentWillMount: function() {
    this.getMessages();
    this.getScore();
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
        if ( this.state.messages && this.state.messages[player.from] ) {
          messages = Object.keys(this.state.messages[player.from]).sort((a, b) => {
            const aDate = new Date(this.state.messages[player.from][a].timestamp);
            const bDate = new Date(this.state.messages[player.from][b].timestamp);
            return aDate - bDate;
          }).map((message_id) => {
            const message = this.state.messages[player.from][message_id];
            const className = `message-container ${message.type}`;
            return (
              <div className="message">
                <div className={className} title={message.timestamp}>
                  {message.body}
                </div>
              </div>
            );
            return message;
          });
        }
        return (
          <div className="phone-container">
            <div className="phone-header">
              <p>From: {player.from}</p>
              <p>To: {player.to}</p>
            </div>
            <div className="phone">
              {messages}
              <div className="clear" />
            </div>
          </div>
        );
      }.bind(this));

      let round_stats;
      if (this.state.data.round) {
        round_stats = (
          <div className="round-stats">
            <p>Phrase: {this.state.data.round.phrase}</p>
            <p>Submission: {this.state.data.round.submission}</p>
            <p>Submitter: {this.state.data.round.submitter.nickname}</p>
            <p>Started: {this.state.data.round.submitter.created}</p>
            <p>Last Activity: {this.state.data.round.submitter.last_activity}</p>
          </div>
        );
      }
      let score_stats;
      if (this.state.score) {
        //score_stats = (
          //<table className="score-stats">
            //<thead><tr><td>Player</td><td>Wins</td></tr></thead>
            //<tbody>
              //{this.state.score.map(row => {
                //return (
                  //<tr>
                    //<td>{row.player}</td>
                    //<td>{row.wins}</td>
                  //</tr>
                //);
              //})}
            //</tbody>
          //</table>
        //);
        score_stats = (
          <table className="score-stats">
            <tbody>
              <tr>
                <td >Player</td>
                {this.state.score.map(row => (
                  <td>{row.player}</td>
                ))}
              </tr>
              <tr>
                <td >Wins</td>
                {this.state.score.map(row => (
                  <td>{row.wins}</td>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }
      content = (
        <div className="game-container">
          <div className="stats">
            <div className="game-stats">
              <p>Created: {this.state.data.created}</p>
              <p>Players: {this.state.data.players.length}</p>
            </div>
            {round_stats}
            {score_stats}
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
