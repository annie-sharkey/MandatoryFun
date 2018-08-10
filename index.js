const { WebClient } = require("@slack/client");
var express = require("express");
var bodyParser = require("body-parser");

//define a port we want to listen to
const PORT = 4390;
const web = new WebClient(process.env.AUTH_TOKEN);
var app = express();

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

//Opens new competition dialog for competition name and description
app.post("/command/new_competition", (req, res) => {
  const { token, trigger_id } = req.body;

  // check that the verification token matches expected value
  if (token === process.env.VERIFICATION_TOKEN) {
    const dialog = JSON.stringify({
      title: "Create a new competition",
      callback_id: "submit-ticket",
      submit_label: "Next",
      elements: [
        {
          label: "Competition Title",
          type: "text",
          name: "title",
          //   value: text,
          placeholder: "Give your competition a unique name"
        },
        {
          label: "Description",
          type: "textarea",
          name: "description",
          placeholder: "Tell your teams a little about the competition"
        }
      ]
    });

    web.dialog
      .open({
        token: process.env.AUTH_TOKEN,
        trigger_id: trigger_id,
        dialog: dialog
      })
      .then(result => {
        res.send("");
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    debug("Verification token mismatch");
    res.sendStatus(500);
  }
});

var selectedChannel;
//Interaction data
app.post("/interaction", (req, res) => {
  const body = JSON.parse(req.body.payload);
  console.log("body: ", body);

  if (body.token === process.env.VERIFICATION_TOKEN) {
    // immediately respond with a empty 200 response to let
    // Slack know the command was received
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

app.post("/command/add_team", (req, res) => {
  console.log("body: ", req.body.user_name);
  console.log("text: ", req.body.text);
  res.send("");

  const channelID = req.body.channel_id;
  const competitionName = req.body.text;

  //TODO: when I connect to db, check that channel isn't already added to the list and that
  //competition name presented exists
  if (competitionName === "") {
    web.chat
      .postMessage({
        channel: channelID,
        text:
          "*`/add_team` must be called with the name of an existing competition*"
      })
      .catch(console.error);
  } else {
    web.chat
      .postMessage({
        channel: channelID,
        text: `Add a team to *_${competitionName}_* by selecting a channel.`,
        attachments: [
          {
            fallback: "Upgrade your Slack client to use messages like these.",
            color: "#3AA3E3",
            attachment_type: "default",
            callback_id: "add_team_to_competition",
            actions: [
              {
                name: "channels_list",
                type: "select",
                data_source: "channels"
              },
              {
                name: "add_team_button",
                text: "Select Team",
                type: "button"
              }
            ]
          }
        ]
      })
      .catch(console.error);
  }

  //choose one channel and hit add
  //then that gets stored with competition name
});
