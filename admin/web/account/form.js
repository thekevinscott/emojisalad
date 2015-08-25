require('../form.less');
import * as React from 'react';
import reqwest from 'reqwest';

import { auth } from '../auth';

export class Form extends React.Component {
  constructor(props) {
    super(props);
    // bind functions to self
    ['handleSubmit', 'handleError'].map(function(fn) {
      this[fn] = this[fn].bind(this);
    }.bind(this));

    this.state = {
      error: null
    };
  }
  handleError(error) {
    this.setState({
      error: error 
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const username = React.findDOMNode(this.refs.username).value.trim();
    const password = React.findDOMNode(this.refs.password).value.trim();

    if (!username) {
      this.handleError('You must provide a username');
    } else if (!password) {
      this.handleError('You must provide a password');
    }

    reqwest({
      url: this.url,
      method: 'post',
      data: {
        username: username,
        password: password
      }
    })
    .then(function (resp) {
      if ( resp.error ) {
        this.handleError(resp.error);
      } else {
        this.handleSuccess(resp);
      }
    }.bind(this), function (err, msg) {
      if ( err ) {
        this.handleError(err);
      } else {
        this.handleError('There was an unknown error');
      }
    }.bind(this));
    return;
  }
  render() {
    return (
            <form onSubmit={this.handleSubmit}>
                <div className="error">
                    {this.state.error}
                </div>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" ref="username"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" ref="password"/>
                </div>
                <div>
                    <input type="submit" value={this.submitValue} />
                </div>
                </form>
    );
  }
}
