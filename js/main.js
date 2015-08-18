$(document).ready(function(){
  // use masking plugin for input phone number
  $('#tel-number').mask('(000) 000-0000');

  $('#wtf').click(function() {
    $('.faq').slideToggle(300,'swing');
  });

  // start chat animation
  loopChat();


  // Send request to server
  $("#submit").click(function(){
    var val1= $("#tel-number").val();
    // $.post('http://192.168.1.140:5000/new', {number: val1 }, function(data) {console.log(data); } )
    $('#submit').html('(spinning)');// execute spin
    setTimeout(function(){
      $('#submit').html('Sent!'); //replace spin with sent
      console.log('The number you submitted is: '+val1);
      setTimeout(function(){
        $('#submit').html('Text another number!');
      },1000); //'sent' duration
    },2000); //spin duration  
  });

  // Submit the form on click enter
  $('#tel-number').keypress(function (e) {
    if (e.which == 13) {
      $(this).blur();
      $('#submit').focus().click();
      return false;
    }
  });
	
});
