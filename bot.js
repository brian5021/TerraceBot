var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var giphy = require('giphy-api')(); // api key goes here
var botID = process.env.BOT_ID;
// cool() for random txt images

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var statusCheck = /^brobot\?/i;
  var botAnimate = /^animate me /i;
  
  if (request.text && botAnimate.test(request.text)) {
    this.res.writeHead(200);
    getGif(request.text, function(err, gifyResponse) {
      if (!err) {
        postMessage(gifyResponse);
      }
      else {
        console.log(err);
        postMessage("nah");
      }
    });
    this.res.end();
  } else if (request.text && statusCheck.test(request.text)) {
    this.res.writeHead(200);
    postMessage("Ayyyyy lmao");
    this.res.end();
  }
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}


function getGif(request, callback) {
  var searchText = request.replace('animate me ', '');
  
  var options = {
    q: searchText,
    limit: 1,
    fmt: 'json'
  };

  giphy.search(options, function(err, res) {
    callback(false, res.data[0].images.original.url)
  });

}


function postMessage(message) {
  var botResponse = message;
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
