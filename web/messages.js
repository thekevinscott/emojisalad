import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from './auth';

import { Base } from './base';

export var Messages = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/messages',
  save: function(message, e) {
    var val = e.target.parentNode.parentNode.getElementsByTagName('textarea')[0].value;
    message.saving = true;
    this.forceUpdate();
    reqwest({
      url: this.url,
      method: 'put',
      data: {
        message_id: message.id,
        message: val
      }
    }).then(function() {
      message.saving = false;
      this.forceUpdate();
    }.bind(this)).fail(function(err) {
      message.saving = false;
      this.forceUpdate();
      alert('There was an error saving: ' + err);
    }.bind(this));
  },
  render: function () {
    var content;
    if ( this.state.loading ) {
      content = "Loading";
    } else if ( this.state.error ) {
      content = this.state.error;
    } else {
      var messages = this.state.data.map(function(message) {
        var save;
        if ( message.saving ) {
          save = <p>saving...</p>;
        } else {
          save = <a onClick={this.save.bind(this, message)}>Save</a>;
        }

        return (
          <tr><td>{message.key}</td><td className="full"><textarea>{message.message}</textarea></td><td>{save}</td><td>x</td></tr>
        );
      }.bind(this));
      content = (<table><thead><tr><td>Key</td><td>Message</td><td>Save</td><td>Delete</td></tr></thead>{messages}</table>);
    }
    return (
      <div className="players page">
      {content}
      </div>
    );
  }
});

