const { WebClient } = require("@slack/client");
var express = require("express");
var bodyParser = require("body-parser");

//define a port we want to listen to
const PORT = 4390;
const web = new WebClient(process.env.AUTH_TOKEN);
var app = express();

//require files
var commandNewCompetition = require("./commandNewCompetition");
var commandAddTeam = require("./commandAddTeam");

module.exports = app;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Starts our server
app.listen(PORT, function() {
  //Callback triggered when server is successfully listening
  console.log("Example app is listening on port " + PORT);
});

// This route handles GET requests to our root ngrok address
app.get("/", function(req, res) {
  res.send("Ngrok is working! Path Hit: " + req.url);
});

//Commands
app.post("/command/new_competition", commandNewCompetition.newCompetition);
app.post("/command/add_team", commandAddTeam.addTeam);

var selectedChannel;
app.post("/interaction", (req, res) => {
  const body = JSON.parse(req.body.payload);
  console.log("body: ", body);

  if (body.token === process.env.VERIFICATION_TOKEN) {
    res.send("");
    if (body.type === "dialog_submission") {
      web.chat
        .postMessage({
          channel: body.channel.id,
          text: `You just created the competition *${body.submission.title}*.`
        })
        .catch(console.error);
    } else if (
      body.type === "interactive_message" &&
      body.callback_id === "add_team_to_competition"
    ) {
      //TODO: make else if condition stronger
      if (body.actions[0].name === "channels_list") {
        selectedChannel = body.actions[0].selected_options[0].value;
        console.log("selectedChannel: ", selectedChannel);
      } else if (
        body.actions[0].name === "add_team_button" &&
        selectedChannel != null
      ) {
        web.chat
          .postMessage({
            channel: body.channel.id,
            text: `The channel you selected was ${selectedChannel}.`
          })
          .catch(console.error);
      }
    }
  } else {
    res.sendStatus(500);
  }
});
