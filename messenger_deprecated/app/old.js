var $ = require('jquery');
var io = require('socket.io-client');

module.exports = function(username, user_id) {
var FADE_TIME = 150; // ms
var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

// Initialize varibles
var $window = $(window);
var $usernameInput = $('.usernameInput'); // Input for username
var $messages = $('.messages'); // Messages area
var $inputMessage = $('.inputMessage'); // Input message input box

// Prompt for setting a username
var $currentInput = $usernameInput.focus();

var socket = io();

  // Tell the server your username
  //socket.emit('add user', { username: username, user_id: user_id });

// Sends a chat message
function sendMessage () {
  var message = $inputMessage.val();
  // Prevent markup from being injected into the message
  // if there is a non-empty message and a socket connection
  if (message) {
    $inputMessage.val('');
    addChatMessage({
      username: username,
      message: message
    });
    // tell server to execute 'new message' and send along one parameter
    socket.emit('new message', {
      username: username,
      message: message
    });
  }
}


$window.keydown(function (event) {
  // Auto-focus the current input when a key is typed
  if (!(event.ctrlKey || event.metaKey || event.altKey)) {
    $currentInput.focus();
  }
  // When the client hits ENTER on their keyboard
  if (event.which === 13) {
    if (username) {
      //sendMessage();
    }
  }
});

  // Socket events

  socket.on('response', function (messages) {
    messages.map(addChatMessage);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

}
