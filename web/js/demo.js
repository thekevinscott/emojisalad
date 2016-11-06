window.onload = function(e){
  // Add a div to the comment area, styles as a right-bubble
  $("#commentArea").append("<div class='bubbledRight animated bounceInUp' id='bubbleRight'></div>");

  // Add the content to the bubble
  $('.bubbledRight').html('<i class="twa twa-blue-heart"></i>');

  // Make that new div visible
  $(".bubbledRight").css({"display":"block"});

  // Timer to remove it from the screen
  setTimeout(function(){ 
    $('.bubbledRight').removeClass('bounceInUp');
    $('.bubbledRight').addClass('bounceOutUp');
  }, 3000);

};