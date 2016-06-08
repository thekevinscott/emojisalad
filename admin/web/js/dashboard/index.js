import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';

const Link = Router.Link;

export const Dashboard = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query) {
      auth.isLoggedIn(transition);
    }
  },
  render: function () {
    return (
      <div className="dashboard page">
        <div className="row">
          <div className="box">
            <h2>62</h2>
            <p>Active Games</p>
          </div>
          <div className="box">
            <h2>82</h2>
            <p>Active Users</p>
          </div>
        </div>
        <div className="row">
          <div className="box">
            <div className="container">
              <h2>82</h2>
              <p>Total Games</p>
            </div>
          </div>
          <div className="box">
            <h2>82</h2>
            <p>Total Users</p>
          </div>
        </div>
      </div>
    );
  }
});
