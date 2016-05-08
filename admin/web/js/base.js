import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from './auth';

export const Base = {
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
    let url;
    if ( typeof this.url === 'string' ) {
      url = this.url;
    } else {
      url = this.url();
    }
    reqwest({
      url: url,
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
        if (this.receiveData) {
          this.receiveData(resp);
        }
      }
    }.bind(this));
  }
};

