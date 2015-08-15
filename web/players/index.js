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
  render: function () {
    console.log('redner dashboard');
    return (
      <div className="players page">
      Players
      </div>
    );
  }
});

