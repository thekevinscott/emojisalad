/* globals $, document */

// default typing time is 1000
var messages = [
  {
    message: '🐺📈📉',
    position: 'left',
    time: 0
  },
  {
    message: 'Big bad wolf',
    position: 'right',
    time: 1000,
  },
  {
    message: 'Wolfgang',
    position: 'right',
    time: 4000,
  },
  {
    message: 'Wolf of Wall Street',
    position: 'right',
    time: 7000,
  },
  {
    message: 'Hey great job yo!',
    message: '<i class="twa twa-space-invader"> 🎉WAHOO 🕶 Roger Dodger wins the round! 🎉 The phrase was WOLF OF WALL STREET 👾 ',
    position: 'left',
    time: 10000,
    typing_time: 0
  }
];

$(document).ready(function() {
  var $demo = $('.demo');
  var demoHeight = $demo.height();
  var $messages = $('.messages');
  var $message = $('.message.card');
  var messageArray;
  var Message = function(message, index) {
    var $el = $message.clone();
    var $main = $el.find('.main');
    var $content = $('<p />');
    $el.addClass(message.position);
    $messages.append($el);
    $main.html($content);

    function top() {
      var offset = 150;
      var totalHeight = (messageArray || []).slice(0, index).reduce(function(height, el) {
        return height + el.getHeight();
      }, 0);
      $el.css({ top: totalHeight});
      $messages.css({ height: totalHeight + demoHeight });
      var demoMarginTop = (demoHeight  - offset < totalHeight) ? demoHeight - totalHeight - offset: 0;
      $demo.css({ marginTop: demoMarginTop });
    }

    function getHeight() {
      return $el.height() + 70;
    }

    function show() {
      top();
      if (message.typing_time !== 0) {
        $content.html('<img src="img/typing.gif" />');
        setTimeout(function() {
          $content.html(message.message);
        }, message.typing_time || 1000);
      } else {
        $content.html(message.message);
      }
    }
    if (message.time > 0) {
      setTimeout(show, message.time);
    } else {
      top();
      $content.html(message.message);
    }
    return {
      getHeight: getHeight
    };
  };

  messageArray = messages.map(function(message, i) {
    return Message(message, i);
  });
});
