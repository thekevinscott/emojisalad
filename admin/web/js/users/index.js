import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from '../auth';

import { Base } from '../base';
const Link = Router.Link;

export var Users = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/users',
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var users = this.state.data.reverse().map((user) => {
        return (
          <tr><td>{user.id}</td><td><Link to="user" params={{user_id: user.id}}>{user.nickname}</Link></td><td>{user.from}</td><td>{user.created}</td></tr>
        );
      });
      content = (<table><thead><tr><td>ID</td><td>Nickname</td><td>Number</td><td>Created</td></tr></thead>{users}</table>);
    }
    return (
      <div className="users page">
      {content}
      </div>
    );
  }
});

export var User = React.createClass({
  mixins: [Base], // Use the mixin
  url: function() {
    return `/api/users/${this.props.params.user_id}`;
  },
  render: function () {
    console.log(this.props);
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      content = (
        <div className="user-container">
          <h1>{this.state.data.nickname}</h1>
          <p>{this.state.data.created}</p>
        </div>
      );
    }
    return (
      <div className="user page">
        {content}
      </div>
    );
  }
});

