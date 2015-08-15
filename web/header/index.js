require("./header.less");

import * as React from 'react';
import * as Router from 'react-router';
const Link = Router.Link;

export class Header extends React.Component {
    render() {
      var account;
      if ( this.props.loggedIn ) {
        account = <Link to="/logout">Log out</Link>;
      } else {
        account = <Link to="/login">Sign in</Link>;
      }

      var links = (
        <ul>
          <li className="account">{account}</li>
          <li><Link to="games">Games</Link></li>
          <li><Link to="players">Players</Link></li>
        </ul>
      );
      return (
        <header>
        {links}
        </header>
      );
    }
}
