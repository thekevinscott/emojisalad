$(document).ready(function(){
  // use masking plugin for input phone number
  $('#tel-number').mask('(000) 000-0000');

  $('#wtf').click(function() {
    $('.faq').slideToggle(300,'swing');
  });

  // start chat animation
  loopChat();

  $("#submit").click(function(){
    // send request to server
    var val1= $("#tel-number").val();
    // $.post('http://192.168.1.140:5000/new', {number: val1 }, function(data) {console.log(data); } )
    
    // execute spinning animation
    $('.submit-text').css('display','none');
    $('.spinner').css('display','inline-block');
    setTimeout(function(){
      $('.submit-text').html('Sent!'); //replace spin with sent
      $('.submit-text').css('display','inline-block');
      $('.spinner').css('display','none'); // execute spin
      console.log('The number you submitted is: '+val1);
      setTimeout(function(){
        $('#tel-number').val('');
        $('.submit-text').html('Text another number');
      },2000); //'sent' duration
    },2500); //spin duration  
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
