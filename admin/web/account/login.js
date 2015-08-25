import * as React from 'react';
import * as Router from 'react-router';

import { Form } from './form';
import { auth } from '../auth';
import { RouterContainer } from '../router';

export class Login extends Form {
  constructor(props) {
    super(props);
    this.url = '/api/login';
    this.submitValue = 'Login';
    this.handleSuccess = this.handleSuccess.bind(this);
  }
  handleSuccess(resp) {
    RouterContainer.get().transitionTo('/');
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

    auth.login(username, password, this.handleSuccess, this.handleError);
    return;
  }
}
