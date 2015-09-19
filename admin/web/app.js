//require("./base.less");

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
        <RouteHandler/>

      </div>
    );
  }
}
