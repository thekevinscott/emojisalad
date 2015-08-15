import * as React from 'react';
import * as Router from 'react-router';
const Link = Router.Link;

export class Header extends React.Component {
    render() {
      var link;
      if ( this.props.loggedIn ) {
        link = <Link to="/logout">Log out</Link>;
      } else {
        link = <Link to="/login">Sign in</Link>;
      }
        return (
            <header>
            {link}
            </header>
        );
    }
}
