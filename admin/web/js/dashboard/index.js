import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';
import { Base } from '../base';

import { auth } from '../auth';

const Link = Router.Link;

export const Dashboard = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/dashboard',
  //statics: {
    //willTransitionTo: function (transition, params, query) {
      //auth.isLoggedIn(transition);
    //}
  //},
  render: function () {
    let content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      content = this.renderDashboard();
    }

    return (
      <div className="dashboard page">
        {content}
      </div>
    );
  },
  renderDashboard() {
    return (
      <div>
        <div className="row">
          <div className="box">
            <h2>{this.state.data.games}</h2>
            <p>Total Games</p>
          </div>
          <div className="box">
            <h2>{this.state.data.users}</h2>
            <p>Total Users</p>
          </div>
          <div className="box">
            <h2>{this.state.data.rounds}</h2>
            <p>Total Rounds Today</p>
          </div>
        </div>
        <div className="row">
          <div className="box">
            <h2>{this.state.data.average_players_in_game}</h2>
            <p>Average number of players in a game</p>
          </div>
        </div>
      </div>
    );
  }
});
