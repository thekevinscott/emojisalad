var defaultMsg = 'no spam, we promise.<br>standard messaging rates apply.';
var errorMsg = 'error: not a valid phone number.<br>please try again.';

$(document).ready(function(){
  $('#tel-messaging').html(defaultMsg);
  $('#tel-number').mask('(000) 000-0000'); // use masking plugin for phone number

  $("#submit").click(function(){
    var enteredPhoneNum= $("#tel-number").val();
    // validate phone number
    if (enteredPhoneNum.length != 14) {
      // throw error
      $('#tel-messaging').addClass('error');
      $('#tel-messaging').html(errorMsg);
      $('#tel-number').focus();
    } else {
      $('#tel-messaging').removeClass('error');
      $('#tel-messaging').html(defaultMsg);
      submitPhoneNumber(enteredPhoneNum);
    }
  });

  // Submit the form on click enter
  $('#tel-number').keypress(function (e) {
    if (e.which == 13) {
      $(this).blur();
      $('#submit').focus().click();
      return false;
    }
  });

  $('#wtf').click(function() {
    $('.faq').slideToggle(300,'swing');
  });

  // start chat animation
  loopChat();

});

function submitPhoneNumber(phoneNum) {
  // send request to server
  // $.post('http://192.168.1.140:5000/new', {number: phoneNum }, function(data) {console.log(data); } )
  console.log('The number you submitted is: ' + phoneNum);
    
  // execute spinning animation
  $('.submit-text').css('display','none');
  $('.spinner').css('display','inline-block');
  setTimeout(function(){
    // replace spin with sent
    $('.submit-text').html('Text sent!');
    $('#submit').addClass('highlight');
    $('.submit-text').css('display','inline-block');
    $('.spinner').css('display','none');
    setTimeout(function(){
      // replace sent with text another number
      $('#tel-number').val('');
      $('#submit').removeClass('highlight');
      $('.submit-text').html('Text another number');
    },1500); //'sent' duration
  },2500); //spin duration  
}