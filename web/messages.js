import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from './auth';

import { Base } from './base';

export var Messages = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/messages',
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var messages = this.state.data.map(function(message) {
        return (
          <tr><td>{message.key}</td><td>{message.message}</td><td>x</td></tr>
        );
      });
      content = (<table><thead><tr><td>Key</td><td>Message</td><td>Delete</td></tr></thead>{messages}</table>);
    }
    return (
      <div className="players page">
      {content}
      </div>
    );
  }
});

