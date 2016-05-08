import * as React from 'react';
import reqwest from 'reqwest';
import * as Router from 'react-router';
import { RouterContainer } from '../router';
import { auth } from '../auth';

import { Form } from './form';

export class Register extends Form {
  constructor(props) {
    super(props);
    this.url = '/api/register';
    this.submitValue = 'Register';
    this.handleSuccess = this.handleSuccess.bind(this);
  }
  handleSuccess(resp) {
    const username = React.findDOMNode(this.refs.username).value.trim();
    const password = React.findDOMNode(this.refs.password).value.trim();

    auth.login(username, password, (resp) => {
      RouterContainer.get().transitionTo('/');
    }, (err) => {
      console.error('some error', err);
    });
    //reqwest({
      //url: '/api/login',
      //method: 'post',
      //data: {
        //username,
        //password
      //}
    //}).then((resp) => {
      //debugger;
      //RouterContainer.get().transitionTo('/');
    //});
  }
  renderToken() {
    return (
      <div>
        <label>Token:</label>
        <input type="token" name="token" ref="token"/>
      </div>
    );
  }
}
