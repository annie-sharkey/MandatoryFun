var express = require("express");
var bodyParser = require("body-parser");

const PORT = 4390;

var app = express();

var newCompetition = require("./commands/NewCompetition");
var addTeam = require("./commands/AddTeam");
var submitNewCompetition = require("./interactions/SubmitNewCompetition");
var submitTeam = require("./interactions/SubmitTeam");
// var addAnotherTeam = require("./interactions/AddAnotherTeam");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, function() {
  console.log("Example app is listening on port " + PORT);
});

app.get("/", function(req, res) {
  res.send("Ngrok is working! Path Hit: " + req.url);
});

//Commands
app.post("/command/new_competition", newCompetition.newCompetition);
app.post("/command/add_team", (req, res) => {
  const body = req.body;
  const channelID = req.body.channel_id;
  res.send("");
  addTeam.addTeam(body, channelID);
});

// var selectedChannel;
app.post("/interaction", (req, res) => {
  const body = JSON.parse(req.body.payload);
  //   console.log("body in index: ", body);
  res.send("");
  if (body.callback_id === "submit-new-competition") {
    submitNewCompetition.submitNewCompetition(body);
  } else if (body.callback_id === "add_team_to_competition") {
    submitTeam.submitTeam(body);
  } else if (
    body.callback_id === "add_another_team" &&
    body.actions[0].name === "yes_another_team"
  ) {
    addTeam.addTeam(body, body.channel.id);
  }
});

module.exports = app;
