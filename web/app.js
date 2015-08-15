require("./base.less");

import * as React from 'react';
import * as Router from 'react-router';
import { Header } from './header';

import { auth } from './auth';
const RouteHandler = Router.RouteHandler;
const Link = Router.Link;

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: auth.isLoggedIn() 
    }
  }
  render() {
    return (
      <div className="admin">
        <Header loggedIn={this.state.loggedIn} />
        <RouteHandler/>

      </div>
    );
  }
}
