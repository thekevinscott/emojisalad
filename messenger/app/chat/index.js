var React = require('react');

var Messages = require('./messages');
var Input = require('./input');

var Chat = React.createClass({
  getInitialState: function() {
    return {
      loading: true
    }
  },

  render: function() {
    return (
      <ul className="pages">
        <li className="chat page">
          <Messages messages={this.props.messages} user={this.props.user} />
          <Input onSubmit={this.props.sendMessage} />
        </li>
      </ul>
    );
  }
});

module.exports = Chat;
