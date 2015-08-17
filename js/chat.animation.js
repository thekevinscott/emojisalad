
// The chat content for the demo. Please feel free to add to this!
var content = [
{
   emoji: "<i class='twa twa-arrow-up'></i><i class='twa twa-on'></i><i class='twa twa-house'></i><i class='twa twa-fire'></i>",
   phrase_1: "GEORGE: The roof is on fire",
   phrase_2: "EMOJIBOT: Good job, George, you got it!<br><br>Alright, John\'s turn."
 },
 {
   emoji: "<i class='twa twa-no-entry-sign'></i><i class='twa twa-stew'></i><i class='twa twa-four'></i><i class='twa twa-point-right'></i>",
   phrase_1: "JOHN: No soup for you!",
   phrase_2: "EMOJIBOT: Good job, John, you got it!<br><br>Alright, Ringo\'s turn."
 },
 {
   emoji: "<i class='twa twa-hocho'></i><i class='twa twa-runner'></i>",
   phrase_1: "RINGO: Serial killer",
   phrase_2: "EMOJIBOT: <i class='twa twa-rotating-light'></i>Wrong answer, Ringo!<i class='twa twa-rotating-light'></i><br><br>Does anyone else know it?"
 },
 {
   emoji: "<i class='twa twa-tiger'></i><i class='twa twa-crown'></i>",
   phrase_1: "PAUL: Lion King!",
   phrase_2: "EMOJIBOT: Good job, Paul, you got it!<br><br>Alright, George\'s turn."
 }
];

// Brings in the chat convo animation.
// Predelay is the number of milliseconds before the animation, id is the element id, and direction is left or right
function BringIn(predelay,id,direction){
  var bounceInDirection = 'bounceIn'+direction;
  setTimeout(function() {
    $(id).addClass(bounceInDirection);
    $(id).css("visibility", "visible");
  },predelay);
}

// Takes out the chat convo with an animation.
// Predelay is the number of milliseconds before the animation, id is the element id, and direction is left or right
function TakeOut(predelay,id,direction){
  var bounceInDirection = 'bounceIn'+direction;
  var bounceOutDirection = 'bounceOut'+direction;
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

// Loop through the chat convo, and then run chatContent to switch the content
function loopChat(){
    BringIn(500,'#chat1-1','Right');
    BringIn(1500,'#chat1-2','Left');
    BringIn(3000,'#chat1-3','Left');
    TakeOut(8000,'#chat1-1','Right');
    TakeOut(8000,'#chat1-2','Left');
    TakeOut(8000,'#chat1-3','Left');
    chatContent(); //
    setTimeout(function(){
      setInterval(loopChat(),8500);
    },8500);
}
