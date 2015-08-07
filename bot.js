var express = require('express'),
   app = express(),
   fs = require('fs'),
   request = require('request'),
   https = require('https'),
   bodyParser = require('body-parser');


var BOT_AUTH = "Bot unique API Key"; // API Key provided by @BotFather
var PORT = "Express Bot Port";  // Port for the Express.
var WEBHOOK = "" // Webhook end point (Where Telegram send the message.)

// SSL Stuff (Yeah, you'll need a verified certificate.)
var server = https.createServer({
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
}, app).listen(PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/' + WEBHOOK, function(req, res){ // Webhook endpoint.
  if (req.body.message.text != undefined && req.body.message.chat.id != undefined) { // Prevent shit from happen.
    var TelegramChatID = req.body.message.chat.id; // Get the ID of the sender.
    var message = req.body.message.text.split(" "); // Split the whole message and get the command.
    if (message[0] == "/help") { // List of commands.
      console.log("Message received.");
      // Do awesome stuff here.
      sendMessage('Awesome stuff', TelegramChatID); // Reply the message.
    }
  }
  res.send('k'); // Sends receive confirmation to Telegram.
});

function sendMessage(message, receiver) {
  var messageJSON = {
    chat_id: receiver, // Message receiver ID.
    text: message // Text of the message.
  }
  request.post({url:'https://api.telegram.org/bot' + BOT_AUTH + '/sendMessage', formData: messageJSON}); // Call telegram REST API and POST your message.
}

function sendPhoto(imagePath, receiver) {
  var messageJSON = {
    chat_id: receiver,
    photo: fs.createReadStream(__dirname + imagePath) // Create a Stream for request POST the file.
  }
  request.post({url:'https://api.telegram.org/bot' + BOT_AUTH + '/sendPhoto', formData: messageJSON});
}

function sendDocument(documentPath, receiver) {
  var messageJSON = {
    chat_id: receiver,
    document: fs.createReadStream(__dirname + documentPath)
  }
  request.post({url:'https://api.telegram.org/bot' + BOT_AUTH + '/sendDocument', formData: messageJSON});
}

function sendAudio(audioPath, receiver) {
  var messageJSON = {
    chat_id: receiver,
    audio: fs.createReadStream(__dirname + audioPath)
  }
  request.post({url:'https://api.telegram.org/bot' + BOT_AUTH + '/sendAudio', formData: messageJSON});
}

console.log("Bot iniciated. At port " + PORT) // Now setup the webhooks.
