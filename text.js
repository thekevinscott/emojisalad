// Twilio Credentials 
var accountSid = 'ACe1033942b378b846fa69be0a58f04778'; 
var authToken = '0b2a36fbb7cb1c6f558163f5fd61f081'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
client.messages.create({ 
    to: "8604608183", 
    from: "12039412722", 
    body: "Hi there dude man",   
}, function(err, message) { 
    console.log(message.sid); 
});

