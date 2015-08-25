require("./header.less");

import * as React from 'react';
import * as Router from 'react-router';
const Link = Router.Link;
import { auth } from '../auth';

export class Header extends React.Component {
    render() {
      var links;
      var account;
      if ( auth.isLoggedIn() ) {
        links = (
          <ul>
          <li className="account"><Link to="/logout">Log out</Link></li>
          <li><Link to="games">Games</Link></li>
          <li><Link to="players">Players</Link></li>
          <li><Link to="messages">Messages</Link></li>
          </ul>
        );
      } else {
        account = <Link to="/login">Sign in</Link>;
      }

      return (
        <header>
        {links}
        </header>
      );
    }
}
