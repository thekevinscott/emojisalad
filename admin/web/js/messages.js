import * as React from 'react';
import * as Router from 'react-router';
import reqwest from 'reqwest';

import { auth } from './auth';

import { Base } from './base';

export var Messages = React.createClass({
  mixins: [Base], // Use the mixin
  url: '/api/messages',
  newMessage: function(message, e) {
    this.setState({
      adding: true
    });
    var key = document.getElementById('key-input').value;
    var newName = document.getElementById('name-input').value; //FIGURE THIS OUT.
    var message = document.getElementById('message-input').value;
    reqwest({
      url: this.url,
      method: 'post',
      data: {
        key: key,
        message: message
      }
    }).then(function(message) {
      this.setState({
        adding: false,
        data: this.state.data.concat([message])
      });
      // this.forceUpdate();
    }.bind(this)).fail(function(err) {
      this.setState({
      adding: false
    });
      // this.forceUpdate();
      alert('There was an error saving: ' + err);
    }.bind(this));
  }
  ,
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
          <tr>
            <td>{message.key}</td>
            <td>{message.name}</td>
            {/* <td>{message.state}</td> */}
            <td className="full">
              <textarea>{message.message}</textarea>
            </td>
            <td>{message.versions}</td>
            <td>{save}</td>
          </tr>
        );
      }.bind(this));
      if (this.state.adding) {
        var entry = (
          <div>
          butts
          </div>
          )

      } else {


      var entry = (
        <div className='new-message-input'>
        <details>
          <summary>Add a new message</summary>
            <label for='key-input'>Key</label>
            <input type='text' id='key-input'></input>
            <label for='name-input'>Name</label>
            <input type='text' id='name-input' disabled></input>
            <label for='message-input'>Message</label>
            <textarea id='message-input'></textarea>
            <button id='submit-message' onClick={this.newMessage}>Submit Message</button>
          </details>
        </div>);
    }
      content = (
        <div>{entry}
        <table>
          <thead>
            <tr>
              <td>Key</td>
              <td>Name</td>
              {/* <td>Game state</td> */}
              <td>Message</td>
              <td>Versions</td>
              <td>Save</td>
            </tr>
          </thead>
          {messages}
        </table></div>);
    }
    return (
      <div className="players page">
      {content}
      </div>
    );
  }
});

