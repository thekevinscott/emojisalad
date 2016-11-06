/* globals $, document */
$(document).ready(function() {
  var message = $('.signup .alert');
  $('form').submit(function(e) {
    e.preventDefault();
    var body = {
      phone: $('.phone').val()
    };
    $('input').focus(function(e) {
      message.html('');
    });
    $('input').attr('disabled', 'disabled');
    message.html('Submitting...');
    $.post('/submit', body, function(data) {
      console.log('back', data);
      $('input').removeAttr('disabled');
      if (data.error) {
        message.html(data.error);
      } else {
        $('.phone').val('');
        message.html('Your phone number was successfully invited! Look for a text soon.');
      }
    });
  });
});
