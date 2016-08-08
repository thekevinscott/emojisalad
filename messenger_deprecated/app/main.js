var React = require('react');
var reqwest = require('reqwest');
var io = require('socket.io-client');
var socket = io();

var Chat = require('./chat');

var App = React.createClass({
  getInitialState: function() {
    return {
      loading: true
    }
  },

  componentDidMount: function() {
    // listen to socket
    socket.on('response', function (messages) {
      this.addMessages(messages);
    }.bind(this));
  },
  componentWillMount: function() {
    var user_id = window.location.pathname.split('/').pop();
    reqwest({
      url: '/api/user/'+user_id
    }).then(function(data) {
      var user = {
        id: data.id,
        username: data.username
      };
      this.setState({
        loading: false,
        user: data,
        messages: data.messages
      });
    }.bind(this));
  },
  addMessages: function(messages) {
    this.setState({
      messages: this.state.messages.concat(messages)
    });
  },
  sendMessage: function(message) {
    this.addMessages({
      message: message,
      type: 'incoming'
    });
    socket.emit('new message', {
      username: this.state.user.username,
      message: message
    });
  },
  render: function(){
    var content;
    if ( this.state.loading ) {
      content = (<p>Loading</p>);
    } else {
      content = <Chat sendMessage={this.sendMessage} user={this.state.user} messages={this.state.messages} />
    }

    return (
      <div className="messenger">
        {content}
      </div>
    );
  }
});

React.render(<App />, document.body);
