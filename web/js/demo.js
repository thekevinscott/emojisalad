window.onload = function(e){

  var content = [
{
   emoji: "<i class='twa twa-arrow-up'></i><i class='twa twa-house'></i><i class='twa twa-on'></i><i class='twa twa-fire'></i>",
   phrase_1: "<i class='twa twa-baseball'></i> Kevin: The roof is on fire",
   phrase_2: "<i class='twa twa-space-invader'></i> Good job, Kevin, you got it!<br>Alright, Ari\'s turn."
 },
 {
   emoji: "<i class='twa twa-no-entry-sign'></i><i class='twa twa-stew'></i><i class='twa twa-four'></i><i class='twa twa-point-right'></i>",
   phrase_1: "<i class='twa twa-dog'></i> Michelle: No soup for you!",
   phrase_2: "<i class='twa twa-space-invader'></i> Good job, Michelle, you got it! Alright, Dave\'s turn."
 },
 {
   emoji: "<i class='twa twa-hocho'></i><i class='twa twa-runner'></i>",
   phrase_1: "<i class='twa twa-balloon'></i> Ari: Serial killer",
   phrase_2: "<i class='twa twa-space-invader'></i> Sorry, Ari. That's not the right answer. I'm sure you'll get it!"
 },
 {
   emoji: "<i class='twa twa-tiger'></i><i class='twa twa-crown'></i>",
   phrase_1: "<i class='twa twa-camera'></i> Michael: Lion King!",
   phrase_2: "<i class='twa twa-space-invader'></i> Good job, Michael, you got it!"
 }
];

// Brings in the chat convo animation.
// Predelay is the number of milliseconds before the animation, id is the element id, and direction is left or right
function BringIn(predelay,id){
  var bounceInDirection = 'bounceInUp';
  setTimeout(function() {
    $(id).addClass(bounceInDirection);
    $(id).css("visibility", "visible");
  },predelay);
}

// Takes out the chat convo with an animation.
// Predelay is the number of milliseconds before the animation, id is the element id, and direction is left or right
function TakeOut(predelay,id){
  var bounceInDirection = 'bounceInUp';
  var bounceOutDirection = 'bounceOutUp';
  // debugger;
  setTimeout(function() {
    $(id).addClass(bounceOutDirection);
    $(id).removeClass(bounceInDirection);
    setTimeout(function(){
      $(id).css("visibility", "hidden");
      $(id).removeClass(bounceOutDirection);
    },500);
  },predelay);
}

// The global variables we're using for the chat convo.
var counter = 0;
var current_content = '';
var emoji = '';
var phrase_1 = '';
var phrase_2 = '';

//Gets the current array item and sets the HTML for the bubbles to those values.
//If it gets to the length of the array, it'll reset it.
function chatContent(){
  current_content = content[counter];
  $("#chat1-1").html(current_content.emoji);
  $("#chat1-2").html(current_content.phrase_1);
  $("#chat1-3").html(current_content.phrase_2);
  if(counter<=content.length-2)
      {counter++;}
      else
      {counter=0;}
}

function loopChat(){
    BringIn(500,'#chat1-1','Right');
    BringIn(4500,'#chat1-2','Left');
    BringIn(6500,'#chat1-3','Left');
    TakeOut(15000,'#chat1-1','Right');
    TakeOut(15000,'#chat1-2','Left');
    TakeOut(15000,'#chat1-3','Left');
    setTimeout(function(){
      setInterval(loopChat(),20000);
    },20000);
    chatContent(); //
}

chatContent();
loopChat();
};


//MY OLD SHIT

// window.onload = function(e){
//   // Add a div to the comment area, styles as a right-bubble
//   $("#commentArea").append("<div class='bubbledRight animated bounceInUp' id='bubbleRight'></div>");

//   // Add the content to the bubble
//   $('.bubbledRight').html('<i class="twa twa-blue-heart"></i>');

//   // Make that new div visible
//   $(".bubbledRight").css({"display":"block"});

//   // Timer to remove it from the screen
//   setTimeout(function(){ 
//     $('.bubbledRight').removeClass('bounceInUp');
//     $('.bubbledRight').addClass('bounceOutUp');
//   }, 3000);

// };