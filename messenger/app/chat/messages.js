var React = require('react/addons');

var cx = React.addons.classSet;

var Messages = React.createClass({
  render: function() {
    var messages = this.props.messages.map(function(message) {
      var username = (message.type === 'incoming') ? this.props.user.username : 'Emojibot' ;
      var classes = "message "+message.type;

      var classes = cx({
        'message': true,
        'incoming': message.type === 'incoming'
      });
      return (
        <li className={classes}>
          <span className="username">{username}</span>
          <span className="messageBody">{message.message}</span>
        </li>
      );
    }.bind(this));
    return (
      <div className="chatArea">
        <ul className="messages">
          <li className="log">Welcome to EmojinaryFriend Messenger</li>
          {messages}
        </ul>
      </div>
    );
  }
});

module.exports = Messages;
