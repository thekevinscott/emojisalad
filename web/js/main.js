$(document).ready(function(){
  // use masking plugin for input phone number
  $('#tel-number').mask('(000) 000-0000');

  // start chat animation
  loopChat();
  
  // Send request to server
  $("#submit").click(function(){
    var val1= $("#tel-number").val();
    console.log('The number you submitted is: '+val1);
    // $.post('http://192.168.1.140:5000/new', {number: val1 }, function(data) {console.log(data); } )
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
