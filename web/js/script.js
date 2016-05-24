/* globals $, document */
$(document).ready(function() {
  var message = $('.invite .message');
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
      $('input').removeAttr('disabled');
      if (data.error) {
        message.html(data.error);
      } else {
        $('.phone').val('');
        message.html('Your phone number was successfully invited! Look for a text soon.');
      }
    });
  });
  $('.test-container').slick({
    // http://kenwheeler.github.io/slick/
    // autoplay: true,
    arrows: false,
    dots: true,
    pauseOnFocus: false,
    pauseOnHover: false
  });
});
