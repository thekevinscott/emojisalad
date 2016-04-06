import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';

var Link = Router.Link;

export var Dashboard = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query) {
      auth.isLoggedIn(transition);
    }
  },
  render: function () {
    console.log('redner dashboard 2');
    return (
      <div className="dashboard page">
        <h1>This is a Dashboard page</h1>
        <ul>
          <li><Link to="games">Games</Link></li>
          <li><Link to="users">Users</Link></li>
        </ul>
      </div>
    );
  }
});
