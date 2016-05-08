/* globals io, SOCKET_PORT, window */
import * as React from 'react';
import * as Router from 'react-router';
import { Header } from './header';

const RouteHandler = Router.RouteHandler;
const Link = Router.Link;

export class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="admin">
        <Header />
        <RouteHandler />
      </div>
    );
  }
}

window.socket = io.connect(`http://127.0.0.1:${SOCKET_PORT}`);
