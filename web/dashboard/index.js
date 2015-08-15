import * as React from 'react';
import reqwest from 'reqwest';

import { auth } from '../auth';

export var Dashboard = React.createClass({
  statics: {
    willTransitionTo: function (transition, params, query) {
      auth.isLoggedIn(transition);
    }
  },
  render: function () {
    console.log('redner dashboard');
    return (
      <div>Dashboard Page</div>
    );
  }
});
