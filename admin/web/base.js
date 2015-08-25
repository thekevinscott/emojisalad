import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from './auth';

export var Base = {
  statics: {
    willTransitionTo: function (transition, params, query) {
      auth.isLoggedIn(transition);
    }
  },
  getInitialState: function() {
    return {
      loading: true,
      data: []
    };
  },
  componentDidMount: function() {
    reqwest({
      url: this.url,
      method: 'get'
    })
    .then(function (resp) {
      if ( ! resp || typeof resp !== 'object' ) {
        this.setState({
          loading: false,
          error: 'Error retrieving data'
        });
      } else if ( resp.error ) {
        this.setState({
          loading: false,
          error: resp.error
        });
      } else {
        this.setState({
          loading: false,
          data: resp
        });
      }
    }.bind(this));
  }
};

