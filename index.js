var express = require("express");
var request = require("request");
const { WebClient } = require("@slack/client");

const web = new WebClient(process.env.SLACK_TOKEN);
var clientId = "412008301361.412019981601";
var clientSecret = "80abffea5bb2e02faa3086a721a607d2";
const conversationID = "CC49F3WE8";

var app = express();

//define a port we want to listen to
const PORT = 4390;

//Starts our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening
  console.log("Example app is listening on port " + PORT);
});

// This route handles GET requests to our root ngrok address
app.get("/", function(req, res) {
  res.send("Ngrok is working! Path Hit: " + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint for handling the logic of the Slack oAuth process behind our app.
app.get("/oauth", function(req, res) {
  // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    console.log("Looks like we're not getting code.");
  } else {
    // If it's there...

    // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
    request(
      {
        url: "https://slack.com/api/oauth.access", //URL to hit
        qs: {
          code: req.query.code,
          client_id: clientId,
          client_secret: clientSecret
        }, //Query string data
        method: "GET" //Specify the method
      },
      function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          res.json(body);
        }
      }
    );
  }
});

app.post("/command/newcompetition", function(req, res) {
  //   res.send(tutorial.fun());
  res.send("It's working");
  var channel = web.channels
    .list()
    .then(resp => {
      console.log(resp.channels[0].name);
    })
    .catch(console.error);

  console.log(channel);
  web.chat
    .postMessage({
      channel: conversationID,
      text: "testing"
    })
    .then(res => {
      console.log("Message sent: ", res.ts);
    })
    .catch(console.error);
});
